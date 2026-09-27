import type { Notification } from '../types/chat'

type NotificationBody = Notification['body']

const TEXT_MESSAGE_TYPES = new Set([
  'textMessage',
  'extendedTextMessage',
  'quotedMessage',
])

export function getIncomingText(body: NotificationBody) {
  if (body.typeWebhook !== 'incomingMessageReceived') return null
  if (!body.messageData?.typeMessage) return null
  if (!TEXT_MESSAGE_TYPES.has(body.messageData.typeMessage)) return null

  return (
    body.messageData.textMessageData?.textMessage ??
    body.messageData.extendedTextMessageData?.text ??
    null
  )
}

export function isNotificationFromChat(
  body: NotificationBody,
  expectedChatId: string,
) {
  const expected = normalizeChatId(expectedChatId)
  const senderIds = [body.senderData?.chatId, body.senderData?.sender]

  return senderIds.some(senderId => normalizeChatId(senderId) === expected)
}

function normalizeChatId(chatId?: string) {
  return chatId?.trim().toLowerCase() ?? ''
}
