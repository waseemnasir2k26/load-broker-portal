import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  format = 'number',
  delay = 0
}) {
  const { count } = useAnimatedCounter(typeof value === 'number' ? value : 0, 1000, true)

  const displayValue = format === 'currency'
    ? `$${count.toLocaleString()}`
    : format === 'percent'
    ? `${count}%`
    : count.toLocaleString()

  return (
    <div
      className="bg-bg-secondary border border-border rounded-xl p-5 glow-card animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold font-heading text-text-primary">
            {typeof value === 'number' ? displayValue : value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-accent-success' : 'text-accent-danger'
            }`}>
              <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-accent-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-accent-primary" />
          </div>
        )}
      </div>
    </div>
  )
}
