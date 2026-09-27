export type GreenApiConfig = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type ConnectionData = GreenApiConfig & {
  chatId: string
}

export type ChatMessage = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
}

export type SendMessageResponse = {
  idMessage: string
}

export type Notification = {
  receiptId: number
  body: {
    typeWebhook?: string
    timestamp?: number
    idMessage?: string
    senderData?: {
      chatId?: string
      sender?: string
      chatName?: string
      senderName?: string
    }
    messageData?: {
      typeMessage?: string
      textMessageData?: {
        textMessage?: string
      }
      extendedTextMessageData?: {
        text?: string
      }
    }
  }
}
