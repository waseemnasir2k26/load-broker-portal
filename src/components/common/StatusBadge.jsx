import { getStatusColor } from '../../utils/formatters'

const statusLabels = {
  posted: 'Posted',
  bidding: 'Bidding',
  assigned: 'Assigned',
  'in-transit': 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected'
}

export default function StatusBadge({ status, pulse = false, size = 'sm' }) {
  const colorClasses = getStatusColor(status)
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${colorClasses} ${sizeClasses}
        ${pulse && status === 'in-transit' ? 'status-pulse' : ''}
      `}
    >
      {status === 'in-transit' && (
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1.5 animate-pulse" />
      )}
      {statusLabels[status] || status}
    </span>
  )
}
