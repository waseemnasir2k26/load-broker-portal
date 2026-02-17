import { MapPin, Package, Scale, Route, DollarSign, Clock } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { formatCurrency, formatDistance, formatWeight, formatRelativeTime } from '../../utils/formatters'

export default function LoadCard({ load, onClick, index = 0 }) {
  return (
    <div
      onClick={onClick}
      className="bg-bg-secondary border border-border rounded-xl p-5 cursor-pointer glow-card animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-accent-primary font-mono font-semibold">{load.id}</p>
          <p className="text-xs text-text-muted mt-1">
            Posted {formatRelativeTime(load.postedDate)}
          </p>
        </div>
        <StatusBadge status={load.status} pulse={load.status === 'in-transit'} />
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-3">
            <div className="w-2 h-2 rounded-full bg-accent-success" />
            <div className="w-0.5 h-8 bg-border my-1" />
            <div className="w-2 h-2 rounded-full bg-accent-danger" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{load.origin}</p>
            <p className="text-sm font-medium text-text-primary mt-6">{load.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="flex items-center text-sm text-text-secondary">
            <Package className="w-4 h-4 mr-2 text-text-muted" />
            {load.equipmentType}
          </div>
          <div className="flex items-center text-sm text-text-secondary">
            <Scale className="w-4 h-4 mr-2 text-text-muted" />
            {formatWeight(load.weight)}
          </div>
          <div className="flex items-center text-sm text-text-secondary">
            <Route className="w-4 h-4 mr-2 text-text-muted" />
            {formatDistance(load.distance)}
          </div>
          <div className="flex items-center text-sm font-semibold text-accent-success">
            <DollarSign className="w-4 h-4 mr-1" />
            {load.rate ? formatCurrency(load.rate) : 'Open'}
          </div>
        </div>

        {load.bidsCount > 0 && (
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-accent-purple">
              {load.bidsCount} bid{load.bidsCount > 1 ? 's' : ''} received
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
