// Agent 对话调用 —— 复用 carwork(FastAPI) 的真实 LLM。
// 刻意用独立 fetch，不走 carwork2 的 axios 实例：
//  1) baseURL 不同（/ai 而非 /api）；
//  2) 不带 carwork2 的 JWT（carwork 的 /agent/chat 匿名可用）；
//  3) 避免 carwork 的 401 误触发 carwork2 的自动登出。

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
  signal?: AbortSignal,
): Promise<AgentChatResult> {
  const resp = await fetch('/ai/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, role, images }),
    signal,
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  return resp.json();
}
