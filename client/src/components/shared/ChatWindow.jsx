import { useState, useRef, useEffect } from 'react'
import { FiSend, FiX, FiZap, FiTrash2 } from 'react-icons/fi'

export default function ChatWindow({ onClose, useChat: chatHook }) {
  const { messages, loading, sendMessage, clearChat } = chatHook
  const [input, setInput]   = useState('')
  const bottomRef           = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">

      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-t-2xl">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <FiZap className="text-white text-sm" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">FixBot</p>
          <p className="text-[10px] text-blue-200">AI Assistant · Always online</p>
        </div>
        <button
          onClick={clearChat}
          className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          title="Clear chat"
        >
          <FiTrash2 className="text-sm" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
              {[0,1,2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="px-3 py-3 bg-white border-t border-slate-100 rounded-b-2xl flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          <FiSend className="text-sm" />
        </button>
      </div>

    </div>
  )
}