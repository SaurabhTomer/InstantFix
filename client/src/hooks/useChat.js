import { useState, useCallback } from 'react'
import axios from 'axios'

export default function useChat(accessToken) {
  const [messages, setMessages] = useState([
    {
      role:    'assistant',
      content: '👋 Hi! I\'m FixBot. I can help you with your requests or diagnose electrical problems. What\'s up?',
    },
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (text, requestId = null) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/chat',
        { messages: updated, requestId },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      )
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }, [messages, accessToken])

  const clearChat = () => setMessages([{
    role:    'assistant',
    content: '👋 Hi! I\'m FixBot. How can I help you today?',
  }])

  return { messages, loading, sendMessage, clearChat }
}