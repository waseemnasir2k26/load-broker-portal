import { useState, useEffect, useRef } from 'react'
import {
  Bug, X, Trash2, Download, Filter, Search,
  ChevronDown, ChevronUp, Copy, AlertTriangle,
  Info, AlertCircle, XCircle, Zap
} from 'lucide-react'
import logger, { LOG_LEVELS, LOG_CATEGORIES } from '../../utils/logger'

const LEVEL_ICONS = {
  DEBUG: Zap,
  INFO: Info,
  WARN: AlertTriangle,
  ERROR: AlertCircle,
  FATAL: XCircle
}

const LEVEL_COLORS = {
  DEBUG: 'text-gray-400',
  INFO: 'text-blue-400',
  WARN: 'text-amber-400',
  ERROR: 'text-red-400',
  FATAL: 'text-red-500'
}

function LogEntry({ log, expanded, onToggle }) {
  const Icon = LEVEL_ICONS[log.levelName] || Info
  const colorClass = LEVEL_COLORS[log.levelName] || 'text-gray-400'

  const copyLog = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2))
  }

  return (
    <div className={`border-b border-border/50 ${log.level >= LOG_LEVELS.ERROR ? 'bg-red-500/5' : ''}`}>
      <div
        className="flex items-start gap-2 p-2 cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
        onClick={onToggle}
      >
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colorClass} bg-current/10`}>
              {log.category}
            </span>
            <span className="text-xs text-text-muted">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-text-primary truncate mt-1">
            {log.message}
          </p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); copyLog() }}
          className="p-1 text-text-muted hover:text-text-primary"
        >
          <Copy className="w-3 h-3" />
        </button>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </div>

      {expanded && (
        <div className="px-8 pb-3 space-y-2">
          {log.data && (
            <div className="bg-bg-tertiary rounded p-2 overflow-x-auto">
              <pre className="text-xs text-text-secondary font-mono">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            </div>
          )}
          {log.stack && (
            <div className="bg-red-500/10 rounded p-2 overflow-x-auto">
              <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                {log.stack}
              </pre>
            </div>
          )}
          <p className="text-xs text-text-muted">ID: {log.id}</p>
        </div>
      )}
    </div>
  )
}

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [logs, setLogs] = useState([])
  const [expandedLogs, setExpandedLogs] = useState(new Set())
  const [filter, setFilter] = useState({
    level: 'all',
    category: 'all',
    search: ''
  })
  const [autoScroll, setAutoScroll] = useState(true)
  const logContainerRef = useRef(null)

  // Subscribe to new logs
  useEffect(() => {
    const unsubscribe = logger.subscribe((logEntry) => {
      if (logEntry.type === 'clear') {
        setLogs([])
        return
      }
      setLogs(prev => [logEntry, ...prev].slice(0, 200))
    })

    // Load existing logs
    setLogs(logger.getLogs({ limit: 200 }))

    return unsubscribe
  }, [])

  // Auto-scroll to top on new logs
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [logs, autoScroll])

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (filter.level !== 'all' && log.level < LOG_LEVELS[filter.level]) {
      return false
    }
    if (filter.category !== 'all' && log.category !== filter.category) {
      return false
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return (
        log.message.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.data).toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const toggleExpanded = (logId) => {
    setExpandedLogs(prev => {
      const next = new Set(prev)
      if (next.has(logId)) {
        next.delete(logId)
      } else {
        next.add(logId)
      }
      return next
    })
  }

  const handleExport = (format) => {
    const content = logger.exportLogs(format)
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs_${new Date().toISOString().slice(0, 10)}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const errorCount = logs.filter(l => l.level >= LOG_LEVELS.ERROR).length

  // Only show in development
  if (!import.meta.env.DEV) {
    return null
  }

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all
          ${errorCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-accent-primary'}
          hover:scale-110`}
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5 text-white" />
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-xs text-white flex items-center justify-center">
            {errorCount > 9 ? '9+' : errorCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={`fixed bottom-0 right-0 z-50 bg-bg-secondary border-l border-t border-border shadow-2xl transition-all
      ${isMinimized ? 'w-72 h-12' : 'w-96 h-[500px]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-bg-tertiary border-b border-border">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">Debug Panel</span>
          {errorCount > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
              {errorCount} errors
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-text-muted hover:text-text-primary"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-text-muted hover:text-text-primary"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Filters */}
          <div className="p-2 border-b border-border space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-7 pr-2 py-1 text-xs bg-bg-tertiary border border-border rounded text-text-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter.level}
                onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
                className="flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border rounded text-text-primary"
              >
                <option value="all">All Levels</option>
                {Object.keys(LOG_LEVELS).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="flex-1 px-2 py-1 text-xs bg-bg-tertiary border border-border rounded text-text-primary"
              >
                <option value="all">All Categories</option>
                {Object.values(LOG_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-bg-tertiary/50">
            <span className="text-xs text-text-muted">
              {filteredLogs.length} logs
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-3 h-3"
                />
                Auto-scroll
              </label>
              <button
                onClick={() => handleExport('json')}
                className="p-1 text-text-muted hover:text-text-primary"
                title="Export JSON"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                onClick={() => logger.clearLogs()}
                className="p-1 text-text-muted hover:text-red-400"
                title="Clear Logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Log List */}
          <div
            ref={logContainerRef}
            className="overflow-y-auto"
            style={{ height: 'calc(100% - 130px)' }}
          >
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <Filter className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No logs match filters</p>
              </div>
            ) : (
              filteredLogs.map(log => (
                <LogEntry
                  key={log.id}
                  log={log}
                  expanded={expandedLogs.has(log.id)}
                  onToggle={() => toggleExpanded(log.id)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
