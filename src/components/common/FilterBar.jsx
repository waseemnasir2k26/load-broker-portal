import { Filter, X } from 'lucide-react'

export default function FilterBar({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll
}) {
  const hasActiveFilters = Object.values(activeFilters).some(v => v && v !== 'all')

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center text-text-secondary text-sm">
        <Filter className="w-4 h-4 mr-2" />
        Filters:
      </div>

      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <select
            value={activeFilters[filter.key] || 'all'}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-bg-tertiary border border-border rounded-lg text-sm text-text-primary cursor-pointer hover:border-accent-primary transition-colors"
          >
            <option value="all">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ))}

      {hasActiveFilters && onClearAll && (
        <button
          onClick={onClearAll}
          className="flex items-center px-3 py-2 text-sm text-accent-danger hover:bg-accent-danger/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </button>
      )}
    </div>
  )
}
