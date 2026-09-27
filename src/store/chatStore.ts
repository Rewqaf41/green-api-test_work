import { create } from 'zustand'
import type {
  ChatMessage,
  ConnectionData,
  GreenApiConfig,
} from '../types/chat'

type ChatState = {
  config: GreenApiConfig | null
  chatId: string
  messages: ChatMessage[]
  pollingError: string
  connect: (data: ConnectionData) => void
  disconnect: () => void
  addMessage: (message: ChatMessage) => void
  setPollingError: (message: string) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  config: null,
  chatId: '',
  messages: [],
  pollingError: '',
  connect: ({ chatId, ...config }) =>
    set({ config, chatId, messages: [], pollingError: '' }),
  disconnect: () =>
    set({ config: null, chatId: '', messages: [], pollingError: '' }),
  addMessage: message =>
    set(state => {
      if (state.messages.some(item => item.id === message.id)) return state
      return { messages: [...state.messages, message] }
    }),
  setPollingError: pollingError => set({ pollingError }),
}))
