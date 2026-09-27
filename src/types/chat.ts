export type GreenApiConfig = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type ConnectionData = GreenApiConfig & {
  chatId: string
}

export type InstanceState =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'sleepMode'
  | 'starting'
  | 'pendingCode'
  | 'pendingPassword'
  | 'suspended'

export type ChatMessage = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
}

export type SendMessageResponse = {
  idMessage: string
}

export type ContactInfo = {
  avatar?: string
  name?: string
  contactName?: string
  chatId?: string
}

export type StateInstanceResponse = {
  stateInstance: InstanceState
}

export type Notification = {
  receiptId: number
  body: {
    typeWebhook?: string
    timestamp?: number
    idMessage?: string
    stateInstance?: InstanceState
    senderData?: {
      chatId?: string
      sender?: string
      chatName?: string
      senderName?: string
      senderContactName?: string
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
