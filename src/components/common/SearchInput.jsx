import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className = ''
}) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, debounceMs)

  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-accent-primary transition-colors"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-hover rounded"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>
      )}
    </div>
  )
}
