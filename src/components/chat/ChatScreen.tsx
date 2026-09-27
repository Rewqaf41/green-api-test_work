import { useSendMessage } from '../../hooks/useSendMessage'
import { getApiErrorMessage } from '../../services/greenApi'
import { useChatStore } from '../../store/chatStore'
import { ChatHeader } from './ChatHeader'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

type ChatScreenProps = {
  onDisconnect: () => void
}

export function ChatScreen({ onDisconnect }: ChatScreenProps) {
  const chatId = useChatStore(state => state.chatId)
  const messages = useChatStore(state => state.messages)
  const pollingError = useChatStore(state => state.pollingError)
  const sendMutation = useSendMessage()
  const sendError = sendMutation.error
    ? getApiErrorMessage(sendMutation.error)
    : ''

  return (
    <main className="grid h-screen grid-rows-[auto_minmax(0,1fr)_auto] bg-[#f5f6fa]">
      <ChatHeader
        chatId={chatId}
        hasConnectionError={Boolean(pollingError)}
        onDisconnect={onDisconnect}
      />
      <MessageList messages={messages} />
      <MessageComposer
        error={sendError || pollingError}
        isSending={sendMutation.isPending}
        onSend={text => sendMutation.mutateAsync(text).then(() => undefined)}
      />
    </main>
  )
}
