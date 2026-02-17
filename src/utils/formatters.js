export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function formatTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function formatDistance(miles) {
  return `${miles.toLocaleString()} mi`
}

export function formatWeight(lbs) {
  return `${lbs.toLocaleString()} lbs`
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// GAP 4: Updated status colors with picked_up and closed
export function getStatusColor(status) {
  // Normalize status (handle both snake_case and kebab-case)
  const normalizedStatus = status?.replace('-', '_')

  const colors = {
    posted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    bidding: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    assigned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    picked_up: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    in_transit: 'bg-[#FA9B00]/20 text-[#FA9B00] border-[#FA9B00]/30',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  return colors[normalizedStatus] || colors[status] || colors.pending
}

// GAP 4: Status icons for activity log
export function getStatusIcon(status) {
  const normalizedStatus = status?.replace('-', '_')

  const icons = {
    posted: '📋',
    bidding: '🔄',
    assigned: '✅',
    picked_up: '📦',
    in_transit: '🚛',
    delivered: '🏁',
    closed: '🔒',
    cancelled: '❌',
    pending: '⏳',
    accepted: '✅',
    rejected: '❌'
  }

  return icons[normalizedStatus] || icons[status] || '📌'
}

// GAP 4: Get status flow order
export function getStatusOrder(status) {
  const order = {
    posted: 1,
    bidding: 2,
    assigned: 3,
    picked_up: 4,
    in_transit: 5,
    delivered: 6,
    closed: 7
  }

  const normalizedStatus = status?.replace('-', '_')
  return order[normalizedStatus] || order[status] || 0
}

export function getScoreColor(score) {
  if (score >= 90) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-red-400'
}

export function getScoreBgColor(score) {
  if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/30'
  if (score >= 70) return 'bg-amber-500/20 border-amber-500/30'
  return 'bg-red-500/20 border-red-500/30'
}

// Calculate route progress percentage
export function calculateRouteProgress(origin, destination, current) {
  if (!origin || !destination || !current) return 0

  // Simple straight-line distance calculation
  const totalDistance = Math.sqrt(
    Math.pow(destination[0] - origin[0], 2) +
    Math.pow(destination[1] - origin[1], 2)
  )

  const coveredDistance = Math.sqrt(
    Math.pow(current[0] - origin[0], 2) +
    Math.pow(current[1] - origin[1], 2)
  )

  const progress = Math.min(100, Math.round((coveredDistance / totalDistance) * 100))
  return isNaN(progress) ? 0 : progress
}
