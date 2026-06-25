import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AGENT_TOOLS } from './agent.schemas';
import { buildSystemPrompt } from './agent.prompts';
import { AgentToolsService } from './agent.tools';

const MAX_STEPS = 8;

interface AgentMessage {
  role: string;
  content: string;
}

export interface AgentChatResult {
  answer: string;
  tool_calls: any[];
  model?: string;
}

/**
 * 对话 Agent：DeepSeek function-calling 主循环 + 视觉识损。
 * 移植自 carwork/backend/app/ai/agent/loop.py。
 */
@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly chatClient: OpenAI;
  private readonly visionClient: OpenAI;
  private readonly chatModel: string;
  private readonly vlModel: string;

  constructor(private readonly tools: AgentToolsService) {
    this.chatClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    });
    this.visionClient = new OpenAI({
      apiKey: process.env.MAAS_API_KEY || '',
      baseURL: process.env.MAAS_BASE_URL || '',
    });
    this.chatModel = process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat';
    this.vlModel = process.env.MAAS_VL_MODEL || 'qwen3-vl-plus';
  }

  async chat(messages: AgentMessage[], images: string[] = [], role = 'customer'): Promise<AgentChatResult> {
    const convo: any[] = [{ role: 'system', content: buildSystemPrompt(role) }];
    for (const m of messages) {
      if ((m.role === 'user' || m.role === 'assistant') && m.content) {
        convo.push({ role: m.role, content: m.content });
      }
    }

    const trace: any[] = [];
    for (let step = 0; step < MAX_STEPS; step++) {
      const resp = await this.chatClient.chat.completions.create({
        model: this.chatModel,
        messages: convo,
        tools: AGENT_TOOLS as any,
        temperature: 0.4,
        max_tokens: 1500,
      });
      const msg: any = resp.choices[0].message;
      const toolCalls = msg.tool_calls || [];

      if (!toolCalls.length) {
        this.logger.log(`agent.done step=${step} tools=${trace.length}`);
        return { answer: msg.content || '', tool_calls: trace, model: resp.model };
      }

      // 把含 tool_calls 的 assistant 消息原样回传
      convo.push({ role: 'assistant', content: msg.content || '', tool_calls: toolCalls });

      for (const tc of toolCalls) {
        const fn = tc.function || {};
        const name = fn.name || '';
        let args: any = {};
        try {
          args = fn.arguments ? JSON.parse(fn.arguments) : {};
        } catch {
          args = { _raw: fn.arguments };
        }
        const record: any = { name, args };
        trace.push(record);
        const out = await this.dispatch(name, args, images);
        record.result = out;
        convo.push({ role: 'tool', tool_call_id: tc.id || '', content: JSON.stringify(out) });
      }
    }

    this.logger.warn(`agent.max_steps tools=${trace.length}`);
    return {
      answer: '抱歉，处理步骤过多未能完成，请稍后重试或转人工。',
      tool_calls: trace,
      model: this.chatModel,
    };
  }

  /** 工具分发：assess_damage 走视觉，其余走 AgentToolsService */
  private async dispatch(name: string, args: any, images: string[]): Promise<any> {
    if (name === 'assess_damage') {
      return this.assessDamage(images, args.focus);
    }
    return this.tools.callTool(name, args);
  }

  /** 视觉识损：调 MAAS 视觉模型，多模态 content 追加 JSON 指令时保留 image_url(chat_json 修复) */
  private async assessDamage(images: string[], focus?: string): Promise<any> {
    if (!images || !images.length) {
      return { error: '用户尚未上传车辆损伤照片，请引导用户拍照上传' };
    }
    if (!process.env.MAAS_API_KEY) {
      return { error: '视觉模型未配置(MAAS_API_KEY)，无法识别照片' };
    }
    const system =
      '你是资深车险定损员。基于车辆损伤照片识别损伤。' +
      '严格输出 JSON: {"damages":[{"part":"部位","type":"划痕/凹陷/破损/裂痕等",' +
      '"severity":"轻微/中度/重度","repair":"喷漆/钣金/更换"}],"summary":"概括","confidence":0-1}。' +
      'repair 字段必须取值: 喷漆、钣金、更换 三者之一。';
    const focusHint = focus ? `重点关注: ${focus}\n` : '';
    const content: any[] = [{ type: 'text', text: `${focusHint}请逐图分析损伤并输出 JSON。` }];
    for (const u of images) content.push({ type: 'image_url', image_url: { url: u } });
    // chat_json 修复：把 JSON 指令作为独立 text 项追加，绝不替换(保留图片)
    content.push({
      type: 'text',
      text: '\n\n请严格仅输出合法 JSON，不要包含 ``` 或额外说明。',
    });

    const resp = await this.visionClient.chat.completions.create({
      model: this.vlModel,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content },
      ],
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });
    let parsed: any = {};
    try {
      parsed = JSON.parse(resp.choices[0].message.content || '{}');
    } catch {
      parsed = {};
    }
    if (parsed.confidence == null) parsed.confidence = 0.6;
    return { assessment: parsed, model: this.vlModel };
  }
}
