// pages/customer/ChatPage.jsx
import { useSelector } from 'react-redux'
import useChat from '../../hooks/useChat'
import ChatWindow from '../../components/shared/ChatWindow'

export default function ChatPage() {
  const accessToken = useSelector(s => s.auth.accessToken)
  const chatHook    = useChat(accessToken)

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col animate-fade-in">
      <ChatWindow useChat={chatHook} />
    </div>
  )
}