import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '../services/greenApi'
import { useChatStore } from '../store/chatStore'

export function useSendMessage() {
  const config = useChatStore(state => state.config)
  const chatId = useChatStore(state => state.chatId)
  const addMessage = useChatStore(state => state.addMessage)

  return useMutation({
    mutationFn: async (text: string) => {
      if (!config || !chatId) throw new Error('Чат не подключён')
      return sendMessage(config, chatId, text)
    },
    onSuccess: (result, text) => {
      addMessage({
        id: result.idMessage,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'sent',
      })
    },
  })
}
