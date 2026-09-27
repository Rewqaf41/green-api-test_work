import { useEffect, useState } from 'react'
import { useContactInfo } from '../../../hooks/useContactInfo'
import { useInstanceState } from '../../../hooks/useInstanceState'
import { useSendMessage } from '../../../hooks/useSendMessage'
import { useTypingNotification } from '../../../hooks/useTypingNotification'
import { getApiErrorMessage } from '../../../services/greenApi'
import { useChatStore } from '../../../store/chatStore'
import type { ChatMessage } from '../../../types/chat'
import { ChatHeader } from './ChatHeader'
import { ChatSidebar } from './ChatSidebar'
import { EmptyChatState } from './EmptyChatState'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import { NewChatDialog } from './NewChatDialog'

const EMPTY_MESSAGES: ChatMessage[] = []

type ChatScreenProps = {
  onDisconnect: () => void
}

export function ChatScreen({ onDisconnect }: ChatScreenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const chatId = useChatStore(state => state.chatId)
  const chat = useChatStore(state =>
    state.chats.find(item => item.chatId === state.chatId),
  )
  const notifiedInstanceState = useChatStore(state => state.instanceState)
  const pollingError = useChatStore(state => state.pollingError)
  const setRecipientProfile = useChatStore(state => state.setRecipientProfile)
  const ensureChat = useChatStore(state => state.ensureChat)
  const selectChat = useChatStore(state => state.selectChat)
  const contactQuery = useContactInfo()
  const instanceStateQuery = useInstanceState()
  const sendMutation = useSendMessage()
  const notifyTyping = useTypingNotification()
  const contactName =
    chat?.recipientName ||
    contactQuery.data?.contactName?.trim() ||
    contactQuery.data?.name?.trim()
  const avatarUrl = chat?.avatarUrl || contactQuery.data?.avatar
  const sendError = sendMutation.error
    ? getApiErrorMessage(sendMutation.error)
    : ''

  function handleCreateChat(nextChatId: string) {
    ensureChat(nextChatId)
    selectChat(nextChatId)
    setIsSidebarOpen(false)
  }

  useEffect(() => {
    if (!chatId || !contactQuery.data) return

    const recipientName =
      contactQuery.data.contactName?.trim() ||
      contactQuery.data.name?.trim()

    setRecipientProfile(chatId, {
      recipientName: recipientName || undefined,
      avatarUrl: contactQuery.data.avatar || undefined,
    })
  }, [chatId, contactQuery.data, setRecipientProfile])

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => setIsNewChatOpen(true)}
        onLogout={onDisconnect}
        isContactLoading={contactQuery.isPending}
      />
      {chatId ? (
        <main className="grid min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto]">
          <ChatHeader
            chatId={chatId}
            contactName={contactName}
            avatarUrl={avatarUrl}
            isContactLoading={!contactName && contactQuery.isPending}
            instanceState={
              notifiedInstanceState || instanceStateQuery.data?.stateInstance || null
            }
            isInstanceStateLoading={instanceStateQuery.isPending}
            hasConnectionError={Boolean(
              pollingError || instanceStateQuery.error,
            )}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
          <MessageList messages={chat?.messages || EMPTY_MESSAGES} />
          <MessageComposer
            error={sendError || pollingError}
            isSending={sendMutation.isPending}
            onSend={text => sendMutation.mutateAsync(text).then(() => undefined)}
            onTyping={notifyTyping}
          />
        </main>
      ) : (
        <EmptyChatState
          onNewChat={() => setIsNewChatOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      )}
      <NewChatDialog
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreate={handleCreateChat}
      />
    </div>
  )
}
