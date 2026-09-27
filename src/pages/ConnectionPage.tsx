import { useNavigate } from 'react-router-dom'
import { ConnectionScreen } from '../components/connection/ConnectionScreen'
import { useChatStore } from '../store/chatStore'
import type { ConnectionData } from '../types/chat'

export function ConnectionPage() {
  const connect = useChatStore(state => state.connect)
  const navigate = useNavigate()

  function handleConnect(data: ConnectionData) {
    connect(data)
    void navigate('/chat')
  }

  return <ConnectionScreen onConnect={handleConnect} />
}
