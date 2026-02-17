import { Package } from 'lucide-react'
import { formatRelativeTime } from '../../utils/formatters'

export default function ConversationList({ conversations, selectedId, onSelect }) {
  return (
    <div className="divide-y divide-border">
      {conversations.map((conv) => (
        <button
          key={conv.loadId}
          onClick={() => onSelect(conv.loadId)}
          className={`
            w-full p-4 text-left transition-colors
            ${selectedId === conv.loadId
              ? 'bg-accent-primary/10 border-l-2 border-accent-primary'
              : 'hover:bg-bg-hover'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-bg-tertiary rounded-lg">
              <Package className="w-5 h-5 text-accent-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-accent-primary font-mono text-sm">
                  {conv.loadId}
                </span>
                <span className="text-xs text-text-muted">
                  {formatRelativeTime(conv.lastMessage?.timestamp)}
                </span>
              </div>
              <p className="text-sm text-text-primary truncate mt-1">
                {conv.lastMessage?.senderName}
              </p>
              <p className="text-sm text-text-secondary truncate">
                {conv.lastMessage?.content}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="min-w-[20px] h-5 flex items-center justify-center text-xs font-semibold bg-accent-primary text-white rounded-full">
                {conv.unreadCount}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
