import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { sendTyping } from '../services/greenApi'
import { useChatStore } from '../store/chatStore'

const TYPING_THROTTLE_MS = 5_000

export function useTypingNotification() {
  const config = useChatStore(state => state.config)
  const chatId = useChatStore(state => state.chatId)
  const lastNotificationAt = useRef(0)
  const mutation = useMutation({
    mutationFn: async () => {
      if (!config || !chatId) return
      await sendTyping(config, chatId)
    },
  })

  return (text: string) => {
    if (!text.trim()) return

    const now = Date.now()
    if (now - lastNotificationAt.current < TYPING_THROTTLE_MS) return

    lastNotificationAt.current = now
    mutation.mutate()
  }
}
