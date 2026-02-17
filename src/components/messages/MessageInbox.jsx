import { useState, useMemo } from 'react'
import { Search, MessageSquare } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ConversationList from './ConversationList'
import MessageThread from './MessageThread'

export default function MessageInbox() {
  const { messages } = useApp()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const conversations = useMemo(() => {
    const convMap = {}
    messages.forEach(msg => {
      if (!convMap[msg.loadId]) {
        convMap[msg.loadId] = {
          loadId: msg.loadId,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        }
      }
      convMap[msg.loadId].messages.push(msg)
      if (!convMap[msg.loadId].lastMessage ||
          new Date(msg.timestamp) > new Date(convMap[msg.loadId].lastMessage.timestamp)) {
        convMap[msg.loadId].lastMessage = msg
      }
      if (!msg.read) {
        convMap[msg.loadId].unreadCount++
      }
    })

    return Object.values(convMap)
      .filter(conv =>
        conv.loadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) =>
        new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp)
      )
  }, [messages, searchQuery])

  const selectedMessages = selectedConversation
    ? messages.filter(m => m.loadId === selectedConversation)
    : []

  return (
    <div className="h-[calc(100vh-12rem)]">
      <h1 className="text-2xl font-bold text-text-primary font-heading mb-6">Messages</h1>

      <div className="flex h-full bg-bg-secondary border border-border rounded-xl overflow-hidden">
        {/* Conversation List */}
        <div className={`
          w-full md:w-80 lg:w-96 border-r border-border flex flex-col
          ${selectedConversation ? 'hidden md:flex' : 'flex'}
        `}>
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">No conversations yet</p>
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedConversation}
                onSelect={setSelectedConversation}
              />
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className={`
          flex-1 flex flex-col
          ${selectedConversation ? 'flex' : 'hidden md:flex'}
        `}>
          {selectedConversation ? (
            <MessageThread
              loadId={selectedConversation}
              messages={selectedMessages}
              onBack={() => setSelectedConversation(null)}
              showHeader
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MessageSquare className="w-16 h-16 text-text-muted mb-4" />
              <p className="text-text-secondary">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
