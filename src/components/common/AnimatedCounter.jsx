import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

export default function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const { count } = useAnimatedCounter(value, duration)

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
