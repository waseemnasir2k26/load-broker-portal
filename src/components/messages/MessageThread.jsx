import { useState } from 'react'
import { ArrowLeft, Package } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import MessageInput from './MessageInput'
import { formatDateTime } from '../../utils/formatters'

export default function MessageThread({ loadId, messages, onBack, showHeader = false }) {
  const { addMessage } = useApp()
  const { user } = useAuth()

  const handleSend = (content) => {
    addMessage({
      loadId,
      senderId: user?.id,
      senderName: user?.name,
      senderRole: user?.role,
      content,
      read: false
    })
  }

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-border flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-bg-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="p-2 bg-accent-primary/20 rounded-lg">
            <Package className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <p className="font-semibold text-accent-primary font-mono">{loadId}</p>
            <p className="text-sm text-text-secondary">Shipment conversation</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sortedMessages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          sortedMessages.map((message, index) => {
            const isOwn = message.senderId === user?.id
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-up`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div
                  className={`
                    max-w-[75%] rounded-xl px-4 py-2.5
                    ${isOwn
                      ? 'bg-accent-primary text-white rounded-br-none'
                      : 'bg-bg-tertiary text-text-primary rounded-bl-none'
                    }
                  `}
                >
                  {!isOwn && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {message.senderName}
                      <span className="ml-2 opacity-60">({message.senderRole})</span>
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/60' : 'text-text-muted'}`}>
                    {formatDateTime(message.timestamp)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  )
}
