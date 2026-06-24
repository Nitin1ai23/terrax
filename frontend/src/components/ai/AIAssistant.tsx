import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkle, Close, Arrow } from '@/components/Icons'
import { useAssistantStore } from '@/store/assistantStore'
import { apiClient, ApiError } from '@/utils/apiClient'

interface ChatResponse {
  reply: string
}

export default function AIAssistant() {
  const { open, messages, context, setOpen, addMessage } = useAssistantStore()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    addMessage({ role: 'user', content: text })
    setBusy(true)
    try {
      const res = await apiClient.post<ChatResponse>('/ai/chat', {
        message: text,
        context,
        history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      })
      addMessage({ role: 'assistant', content: res.reply })
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 0
          ? "I can't reach the analysis server right now. Your work is safe — try again once the API is back."
          : 'Something went wrong handling that. Try rephrasing, or check the server logs.'
      addMessage({ role: 'assistant', content: msg })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 360 }}
          animate={{ x: 0 }}
          exit={{ x: 360 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="fixed top-0 right-0 z-50 h-screen w-[340px] bg-surface border-l border-border flex flex-col"
        >
          <header className="h-16 px-5 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2 text-topo">
              <Sparkle size={18} />
              <span className="font-display font-semibold text-sm">TERRAX AI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text-primary p-1.5"
              aria-label="Close assistant"
            >
              <Close size={18} />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[90%] text-sm leading-relaxed rounded-md px-3.5 py-2.5 ${
                  m.role === 'user'
                    ? 'ml-auto bg-topo/10 border border-topo/20 text-text-primary'
                    : 'bg-void border border-border text-text-primary'
                }`}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="bg-void border border-border rounded-md px-3.5 py-2.5 w-20">
                <svg viewBox="0 0 60 12" className="contour-loader w-full text-topo">
                  <path d="M2 6 Q10 1 18 6 T34 6 T50 6 T58 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex items-end gap-2 border border-border rounded-md bg-void px-3 py-2 focus-within:border-topo/50 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void send()
                  }
                }}
                rows={1}
                placeholder="Ask about models, parameters, or results…"
                className="flex-1 bg-transparent outline-none resize-none text-sm text-text-primary placeholder:text-text-muted/60 max-h-24"
              />
              <button
                onClick={() => void send()}
                disabled={busy || !input.trim()}
                className="text-topo disabled:text-text-muted/40 p-1 transition-colors"
                aria-label="Send message"
              >
                <Arrow size={18} />
              </button>
            </div>
            <p className="data-label mt-2 text-center !text-[10px]">
              Context: {context.page}
              {context.lastAnalysis ? ` · ${context.lastAnalysis}` : ''}
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
