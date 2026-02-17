import { MapPin, Clock, Check, Truck } from 'lucide-react'
import { formatDateTime } from '../../utils/formatters'

export default function TrackingTimeline({ tracking }) {
  const history = tracking?.history || []

  if (history.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Location History</h3>
        <p className="text-text-secondary text-center py-8">No tracking history available</p>
      </div>
    )
  }

  const getIcon = (status) => {
    if (status.includes('Delivered')) return Check
    if (status.includes('Picked up')) return Truck
    return MapPin
  }

  const getColor = (status) => {
    if (status.includes('Delivered')) return 'text-accent-success bg-accent-success/20'
    if (status.includes('Picked up')) return 'text-accent-primary bg-accent-primary/20'
    return 'text-accent-warning bg-accent-warning/20'
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Location History</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {history.slice().reverse().map((entry, index) => {
          const Icon = getIcon(entry.status)
          const colorClasses = getColor(entry.status)

          return (
            <div
              key={index}
              className="flex items-start gap-3 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-lg ${colorClasses}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-primary font-medium">{entry.location}</p>
                    <p className="text-sm text-text-secondary">{entry.status}</p>
                    {entry.note && (
                      <p className="text-xs text-text-muted mt-1">{entry.note}</p>
                    )}
                  </div>
                  <p className="text-xs text-text-muted whitespace-nowrap ml-4">
                    {formatDateTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
