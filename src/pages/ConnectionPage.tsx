import { Navigate, useNavigate } from 'react-router-dom'
import { ConnectionScreen } from '../components/el/connection/ConnectionScreen'
import { useChatStore } from '../store/chatStore'
import type { ConnectionData } from '../types/chat'

export function ConnectionPage() {
  const config = useChatStore(state => state.config)
  const connect = useChatStore(state => state.connect)
  const navigate = useNavigate()

  function handleConnect(data: ConnectionData) {
    connect(data)
    void navigate('/chat')
  }

  if (config) return <Navigate to="/chat" replace />

  return <ConnectionScreen initialConfig={config} onConnect={handleConnect} />
}
