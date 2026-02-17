import { getScoreColor, getScoreBgColor } from '../../utils/formatters'

export default function ScoreBadge({ score, size = 'sm' }) {
  const colorClass = getScoreColor(score)
  const bgClass = getScoreBgColor(score)

  const sizeClasses = size === 'lg'
    ? 'text-2xl font-bold'
    : 'text-sm font-semibold'

  return (
    <span className={`${colorClass} ${sizeClasses}`}>
      {score}%
    </span>
  )
}
