import { getStatusColor, getStatusIcon } from '../../utils/formatters'

// GAP 4: Updated status labels including picked_up and closed
const statusLabels = {
  posted: 'Posted',
  bidding: 'Bidding',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  'in-transit': 'In Transit', // Legacy support
  delivered: 'Delivered',
  closed: 'Closed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected'
}

export default function StatusBadge({ status, pulse = false, size = 'sm', showIcon = false }) {
  const colorClasses = getStatusColor(status)
  const icon = showIcon ? getStatusIcon(status) : null
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs'

  // Normalize status for comparison
  const normalizedStatus = status?.replace('-', '_')
  const isInTransit = normalizedStatus === 'in_transit'
  const isPickedUp = normalizedStatus === 'picked_up'

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${colorClasses} ${sizeClasses}
        ${pulse && (isInTransit || isPickedUp) ? 'status-pulse' : ''}
      `}
    >
      {showIcon && icon && (
        <span className="mr-1.5">{icon}</span>
      )}
      {isInTransit && !showIcon && (
        <span className="w-1.5 h-1.5 bg-[#FA9B00] rounded-full mr-1.5 animate-pulse" />
      )}
      {isPickedUp && !showIcon && (
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-1.5 animate-pulse" />
      )}
      {statusLabels[status] || statusLabels[normalizedStatus] || status}
    </span>
  )
}
