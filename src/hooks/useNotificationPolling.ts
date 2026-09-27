import { useEffect } from 'react'
import {
  deleteNotification,
  getApiErrorMessage,
  receiveNotification,
} from '../services/greenApi'
import { useChatStore } from '../store/chatStore'
import {
  getIncomingText,
  isNotificationFromChat,
} from '../utils/notification'

const EMPTY_RESPONSE_RETRY_DELAY_MS = 1_000
const ERROR_RETRY_DELAY_MS = 3_000

function wait(delay: number) {
  return new Promise(resolve => window.setTimeout(resolve, delay))
}

export function useNotificationPolling() {
  const config = useChatStore(state => state.config)
  const chatId = useChatStore(state => state.chatId)
  const addMessage = useChatStore(state => state.addMessage)
  const setPollingError = useChatStore(state => state.setPollingError)

  useEffect(() => {
    if (!config || !chatId) return

    const controller = new AbortController()
    let isActive = true

    async function poll() {
      if (!config) return

      while (isActive) {
        try {
          const notification = await receiveNotification(config, controller.signal)
          if (!notification) {
            setPollingError('')
            await wait(EMPTY_RESPONSE_RETRY_DELAY_MS)
            continue
          }

          const { body, receiptId } = notification
          const text = getIncomingText(body)
          const isCurrentChat = isNotificationFromChat(body, chatId)

          if (isCurrentChat && text) {
            addMessage({
              id: body.idMessage || `incoming-${receiptId}`,
              text,
              direction: 'incoming',
              timestamp: (body.timestamp || Date.now() / 1000) * 1000,
            })
          }

          await deleteNotification(config, receiptId, controller.signal)
          setPollingError('')
        } catch (error) {
          if (controller.signal.aborted) return
          setPollingError(getApiErrorMessage(error))
          await wait(ERROR_RETRY_DELAY_MS)
        }
      }
    }

    void poll()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [addMessage, chatId, config, setPollingError])
}
