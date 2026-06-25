// Agent 对话调用 —— 现在直连 carwork2 自家 NestJS 的 /agent/chat（同源 + 自带 JWT）。
import api from './request';

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentToolCall {
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

export interface AgentChatResult {
  answer: string;
  tool_calls?: AgentToolCall[];
  model?: string | null;
}

export async function agentChat(
  messages: AgentMessage[],
  images: string[] = [],
  role = 'customer',
): Promise<AgentChatResult> {
  return api.post('/agent/chat', { messages, role, images });
}
