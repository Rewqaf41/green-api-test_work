import { create } from 'zustand'
import type {
  ChatMessage,
  ConnectionData,
  GreenApiConfig,
  InstanceState,
} from '../types/chat'

type ChatState = {
  config: GreenApiConfig | null
  chatId: string
  recipientName: string
  instanceState: InstanceState | null
  messages: ChatMessage[]
  pollingError: string
  connect: (data: ConnectionData) => void
  disconnect: () => void
  addMessage: (message: ChatMessage) => void
  setRecipientName: (name: string) => void
  setInstanceState: (state: InstanceState) => void
  setPollingError: (message: string) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  config: null,
  chatId: '',
  recipientName: '',
  instanceState: null,
  messages: [],
  pollingError: '',
  connect: ({ chatId, ...config }) =>
    set({
      config,
      chatId,
      recipientName: '',
      instanceState: null,
      messages: [],
      pollingError: '',
    }),
  disconnect: () =>
    set({
      config: null,
      chatId: '',
      recipientName: '',
      instanceState: null,
      messages: [],
      pollingError: '',
    }),
  addMessage: message =>
    set(state => {
      if (state.messages.some(item => item.id === message.id)) return state
      return { messages: [...state.messages, message] }
    }),
  setRecipientName: recipientName => set({ recipientName }),
  setInstanceState: instanceState => set({ instanceState }),
  setPollingError: pollingError => set({ pollingError }),
}))
