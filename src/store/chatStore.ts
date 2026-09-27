import { create } from 'zustand'
import type { ConnectionData, GreenApiConfig } from '../types/chat'

type ChatState = {
  config: GreenApiConfig | null
  chatId: string
  connect: (data: ConnectionData) => void
  disconnect: () => void
}

export const useChatStore = create<ChatState>()(set => ({
  config: null,
  chatId: '',
  connect: ({ chatId, ...config }) => set({ config, chatId }),
  disconnect: () => set({ config: null, chatId: '' }),
}))
