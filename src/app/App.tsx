import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatPage } from '../pages/ChatPage'
import { ConnectionPage } from '../pages/ConnectionPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectionPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
