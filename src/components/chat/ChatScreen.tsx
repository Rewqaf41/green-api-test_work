import { useContactInfo } from '../../hooks/useContactInfo'
import { useInstanceState } from '../../hooks/useInstanceState'
import { useSendMessage } from '../../hooks/useSendMessage'
import { useTypingNotification } from '../../hooks/useTypingNotification'
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
  const recipientName = useChatStore(state => state.recipientName)
  const notifiedInstanceState = useChatStore(state => state.instanceState)
  const messages = useChatStore(state => state.messages)
  const pollingError = useChatStore(state => state.pollingError)
  const contactQuery = useContactInfo()
  const instanceStateQuery = useInstanceState()
  const sendMutation = useSendMessage()
  const notifyTyping = useTypingNotification()
  const contactName =
    recipientName ||
    contactQuery.data?.contactName?.trim() ||
    contactQuery.data?.name?.trim()
  const sendError = sendMutation.error
    ? getApiErrorMessage(sendMutation.error)
    : ''

  return (
    <main className="grid h-screen grid-rows-[auto_minmax(0,1fr)_auto] bg-[#f5f6fa]">
      <ChatHeader
        chatId={chatId}
        contactName={contactName}
        avatarUrl={contactQuery.data?.avatar}
        isContactLoading={!contactName && contactQuery.isPending}
        instanceState={notifiedInstanceState || instanceStateQuery.data?.stateInstance || null}
        isInstanceStateLoading={instanceStateQuery.isPending}
        hasConnectionError={Boolean(pollingError || instanceStateQuery.error)}
        onDisconnect={onDisconnect}
      />
      <MessageList messages={messages} />
      <MessageComposer
        error={sendError || pollingError}
        isSending={sendMutation.isPending}
        onSend={text => sendMutation.mutateAsync(text).then(() => undefined)}
        onTyping={notifyTyping}
      />
    </main>
  )
}
