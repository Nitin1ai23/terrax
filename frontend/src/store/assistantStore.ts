import { create } from 'zustand'
import type { ChatMessage, AssistantContext } from '@/types'

interface AssistantState {
  open: boolean
  messages: ChatMessage[]
  context: AssistantContext
  toggle: () => void
  setOpen: (open: boolean) => void
  setContext: (ctx: Partial<AssistantContext>) => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void
}

export const useAssistantStore = create<AssistantState>((set) => ({
  open: false,
  messages: [
    {
      id: 'seed',
      role: 'assistant',
      content:
        "I'm TERRAX AI. Tell me about your dataset and goal — e.g. \"elevation data from a mining site\" — and I'll recommend the right model and parameters.",
      createdAt: Date.now(),
    },
  ],
  context: { page: 'landing' },
  toggle: () => set((s) => ({ open: !s.open })),
  setOpen: (open) => set({ open }),
  setContext: (ctx) => set((s) => ({ context: { ...s.context, ...ctx } })),
  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, { ...msg, id: crypto.randomUUID(), createdAt: Date.now() }],
    })),
}))
