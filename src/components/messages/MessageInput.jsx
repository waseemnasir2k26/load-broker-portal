import { useState } from 'react'
import { Send } from 'lucide-react'

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message.trim())
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-primary"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
