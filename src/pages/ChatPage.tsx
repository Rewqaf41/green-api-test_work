import { Navigate, useNavigate } from 'react-router-dom'
import { ChatScreen } from '../components/chat/ChatScreen'
import { useChatStore } from '../store/chatStore'

export function ChatPage() {
  const isConnected = useChatStore(state => Boolean(state.config))
  const disconnect = useChatStore(state => state.disconnect)
  const navigate = useNavigate()

  if (!isConnected) return <Navigate to="/" replace />

  function handleDisconnect() {
    disconnect()
    void navigate('/', { replace: true })
  }

  return <ChatScreen onDisconnect={handleDisconnect} />
}
