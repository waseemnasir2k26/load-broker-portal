import { Package, Gavel, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { formatRelativeTime } from '../../utils/formatters'

const activities = [
  {
    id: 1,
    type: 'load_posted',
    message: 'Load #SH-4821 posted by Acme Corp',
    timestamp: '2026-02-17T10:30:00Z',
    icon: Package,
    color: 'text-accent-primary'
  },
  {
    id: 2,
    type: 'bid_received',
    message: 'Carrier FastHaul LLC bid $2,450 on Load #SH-4819',
    timestamp: '2026-02-17T09:45:00Z',
    icon: Gavel,
    color: 'text-accent-purple'
  },
  {
    id: 3,
    type: 'delivered',
    message: 'Load #SH-4815 delivered — Score: 98%',
    timestamp: '2026-02-17T08:30:00Z',
    icon: CheckCircle,
    color: 'text-accent-success'
  },
  {
    id: 4,
    type: 'in_transit',
    message: 'Load #SH-4812 picked up, now in transit to Las Vegas',
    timestamp: '2026-02-17T07:15:00Z',
    icon: Truck,
    color: 'text-accent-warning'
  },
  {
    id: 5,
    type: 'bid_accepted',
    message: 'Bid accepted for Load #SH-4811 — Carrier: FastHaul LLC',
    timestamp: '2026-02-17T06:00:00Z',
    icon: CheckCircle,
    color: 'text-accent-success'
  },
  {
    id: 6,
    type: 'load_posted',
    message: 'Load #SH-4820 posted by Pacific Steel Works',
    timestamp: '2026-02-17T05:30:00Z',
    icon: Package,
    color: 'text-accent-primary'
  },
  {
    id: 7,
    type: 'alert',
    message: 'Load #SH-4807 running 30 mins behind schedule',
    timestamp: '2026-02-17T04:45:00Z',
    icon: AlertCircle,
    color: 'text-accent-danger'
  }
]

export default function ActivityFeed() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5 animate-fade-up">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`p-2 rounded-lg bg-bg-tertiary ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary">{activity.message}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
