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

export function getStatusColor(status) {
  const colors = {
    posted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    bidding: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    assigned: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'in-transit': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  return colors[status] || colors.pending
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
