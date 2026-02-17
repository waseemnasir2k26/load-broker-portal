import { Truck, Package, MessageSquare, FileText, Users } from 'lucide-react'

const icons = {
  loads: Package,
  trucks: Truck,
  messages: MessageSquare,
  contracts: FileText,
  users: Users
}

export default function EmptyState({
  type = 'loads',
  title = 'No data found',
  description = 'There is nothing to display yet.',
  action,
  actionLabel
}) {
  const Icon = icons[type] || Package

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-6 bg-bg-tertiary rounded-full mb-6">
        <Icon className="w-12 h-12 text-text-muted" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors btn-primary"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  )
}
