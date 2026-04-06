import { useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import useChat from '../../hooks/useChat'
import ChatWindow from './ChatWindow'

export default function FloatingChat() {
  const [open, setOpen]     = useState(false)
  const accessToken         = useSelector(s => s.auth.accessToken)
  const chatHook            = useChat(accessToken)

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

      {/* chat window */}
      {open && (
        <div className="w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in flex flex-col">
          <ChatWindow onClose={() => setOpen(false)} useChat={chatHook} />
        </div>
      )}

      {/* bubble button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {open
          ? <FiX className="text-xl" />
          : <FiMessageCircle className="text-xl" />
        }
      </button>
    </div>
  )
}