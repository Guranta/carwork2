import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Sparkles, RefreshCw, Camera } from 'lucide-react';
import { agentChat, type AgentMessage } from '../api/agent';
import { fileToCompressedDataUrl } from '../utils/image';
import TabBar from '../components/TabBar';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  toolCalls?: { name: string }[];
  model?: string;
  pending?: boolean;
  error?: boolean;
}

const QUICK = [
  '我车牌沪B88888，帮我判断能不能赔本车损伤',
  '理赔需要准备哪些材料？',
  '报案后一般多久能定损？',
  '车险理赔的流程是怎样的？',
];

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;

// 轻量 markdown 渲染：仅处理 **加粗** 与换行，保持 carwork2 自包含（不引入新依赖）
function renderText(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i} className="block min-h-[1em]">
      {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
        seg.startsWith('**') && seg.endsWith('**') ? (
          <strong key={j} className="font-semibold">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      )}
    </span>
  ));
}

export default function Agent() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const grow = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`;
  };

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next: string[] = [];
      for (const f of Array.from(files).slice(0, 6)) {
        next.push(await fileToCompressedDataUrl(f));
      }
      setImages((prev) => [...prev, ...next].slice(0, 6));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const send = useCallback(
    async (raw: string, imgs: string[]) => {
      const content = raw.trim();
      if (loading || (!content && imgs.length === 0)) return;

      const userMsg: UIMessage = {
        id: genId(),
        role: 'user',
        content: content || '（上传了车辆损伤照片，请帮我识别并评估）',
        images: imgs.length ? imgs : undefined,
      };
      // 发给后端的历史 = 既有消息 + 本轮（只取 role/content）
      const history: AgentMessage[] = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const pendingId = genId();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: pendingId, role: 'assistant', content: '', pending: true },
      ]);
      setText('');
      setImages([]);
      setLoading(true);
      requestAnimationFrame(() => taRef.current && (taRef.current.style.height = 'auto'));

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const data = await agentChat(history, imgs, 'customer', ctrl.signal);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  ...m,
                  pending: false,
                  content: data.answer || '(无回复)',
                  toolCalls: data.tool_calls?.map((t) => ({ name: t.name })),
                  model: data.model || undefined,
                }
              : m,
          ),
        );
      } catch (e) {
        const aborted = e instanceof DOMException && e.name === 'AbortError';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? { ...m, pending: false, error: !aborted, content: aborted ? '已取消' : '请求失败，请稍后重试' }
              : m,
          ),
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [loading, messages],
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
  };

  const submit = () => send(text, images);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0F0F0] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E6F9F1] flex items-center justify-center">
            <Sparkles size={18} className="text-[#00B96B]" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1A1A1A] leading-tight">Agent</h1>
            <p className="text-[10px] text-[#BFBFBF] leading-tight">车险理赔智能助手</p>
          </div>
        </div>
        <button
          className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center active:scale-90 transition-transform"
          onClick={reset}
          aria-label="新对话"
        >
          <RefreshCw size={15} className="text-[#8C8C8C]" />
        </button>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingBottom: '150px' }}
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5 mt-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00B96B] to-[#00A35E] flex items-center justify-center mb-3">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-[#1A1A1A] text-lg font-bold mb-1">你好，我是理赔 Agent</h2>
            <p className="text-[#8C8C8C] text-sm leading-relaxed mb-4">
              可以问我保单能否理赔、理赔流程与材料，也能上传车损照片帮你识别估价。
            </p>
            <div className="space-y-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  className="w-full text-left bg-[#F5F7FA] rounded-xl px-3.5 py-2.5 text-[13px] text-[#1A1A1A] active:scale-[0.98] transition-transform"
                  onClick={() => send(q, [])}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, idx) => {
              const mine = m.role === 'user';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${mine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {m.images?.length ? (
                      <div className={`flex gap-1.5 mb-1.5 flex-wrap ${mine ? 'justify-end' : ''}`}>
                        {m.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`图片${i + 1}`}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words ${
                        mine
                          ? 'bg-[#00B96B] text-white rounded-tr-md'
                          : m.error
                            ? 'bg-[#FFF1F0] text-[#D14343] rounded-tl-md'
                            : 'bg-white text-[#1A1A1A] rounded-tl-md shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                      }`}
                    >
                      {m.pending ? (
                        <span className="text-[#8C8C8C] inline-flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00B96B] animate-bounce" />
                          正在分析…
                        </span>
                      ) : (
                        renderText(m.content)
                      )}
                    </div>
                    {!mine && !m.pending && (m.toolCalls?.length || m.model) ? (
                      <div className="flex items-center gap-1.5 mt-1 px-1 flex-wrap">
                        {m.toolCalls?.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-[#00B96B] bg-[#E6F9F1] rounded-full px-2 py-0.5"
                          >
                            {t.name}
                          </span>
                        ))}
                        {m.model ? (
                          <span className="text-[10px] text-[#BFBFBF]">{m.model}</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer（固定在 TabBar 上方） */}
      <div className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0F0F0] px-3 pt-2 pb-2" style={{ bottom: '56px' }}>
        {images.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {images.map((src, i) => (
              <div key={i} className="relative shrink-0">
                <img src={src} alt={`预览${i + 1}`} className="w-12 h-12 rounded-lg object-cover" />
                <button
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            className="w-9 h-9 shrink-0 rounded-xl bg-[#E6F9F1] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
            onClick={() => fileRef.current?.click()}
            disabled={busy || loading}
            aria-label="上传车损照片"
          >
            {busy ? <Camera size={18} className="text-[#00B96B]" /> : <Plus size={20} className="text-[#00B96B]" />}
          </button>
          <textarea
            ref={taRef}
            rows={1}
            value={text}
            placeholder="问理赔、查保单，或上传车损照片…"
            onChange={(e) => {
              setText(e.target.value);
              grow();
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            className="flex-1 resize-none max-h-24 bg-[#F5F7FA] rounded-xl px-3 py-2 text-[14px] text-[#1A1A1A] outline-none placeholder:text-[#BFBFBF]"
          />
          <button
            className="w-9 h-9 shrink-0 rounded-xl bg-[#00B96B] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
            onClick={submit}
            disabled={loading || busy || (!text.trim() && images.length === 0)}
            aria-label="发送"
          >
            <Send size={17} className="text-white" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => pick(e.target.files)}
        />
      </div>

      <TabBar />
    </div>
  );
}
