export function SkeletonCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <div className="skeleton h-4 w-24 rounded mb-3" />
      <div className="skeleton h-8 w-32 rounded mb-2" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-border">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton h-4 w-40 rounded flex-1" />
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex space-x-4">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-4 w-40 rounded flex-1" />
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

export function SkeletonMap() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl h-64 skeleton" />
  )
}

export default function SkeletonLoader({ type = 'card', count = 1, ...props }) {
  const components = {
    card: SkeletonCard,
    row: SkeletonRow,
    table: SkeletonTable,
    map: SkeletonMap
  }

  const Component = components[type] || SkeletonCard

  if (count === 1) {
    return <Component {...props} />
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} {...props} />
      ))}
    </div>
  )
}
