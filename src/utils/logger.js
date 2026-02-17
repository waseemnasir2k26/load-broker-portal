/**
 * Comprehensive Logging Utility for Load Broker Portal
 * Provides structured logging with levels, categories, and persistence
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
}

const LOG_CATEGORIES = {
  AUTH: 'AUTH',
  ROUTE: 'ROUTE',
  API: 'API',
  STATE: 'STATE',
  RENDER: 'RENDER',
  USER: 'USER',
  ERROR: 'ERROR',
  PERFORMANCE: 'PERF',
  SYSTEM: 'SYSTEM'
}

// In-memory log storage for debug panel
const logStore = []
const MAX_LOGS = 500

// Subscribers for real-time log updates
const subscribers = new Set()

const getTimestamp = () => new Date().toISOString()

const formatMessage = (level, category, message, data) => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  timestamp: getTimestamp(),
  level,
  levelName: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level),
  category,
  message,
  data: data ? JSON.parse(JSON.stringify(data)) : null,
  stack: level >= LOG_LEVELS.ERROR ? new Error().stack : null
})

const addLog = (logEntry) => {
  logStore.unshift(logEntry)
  if (logStore.length > MAX_LOGS) {
    logStore.pop()
  }

  // Notify subscribers
  subscribers.forEach(callback => callback(logEntry))

  // Persist critical logs to localStorage
  if (logEntry.level >= LOG_LEVELS.ERROR) {
    persistCriticalLog(logEntry)
  }
}

const persistCriticalLog = (logEntry) => {
  try {
    const criticalLogs = JSON.parse(localStorage.getItem('lbp_critical_logs') || '[]')
    criticalLogs.unshift(logEntry)
    if (criticalLogs.length > 50) criticalLogs.pop()
    localStorage.setItem('lbp_critical_logs', JSON.stringify(criticalLogs))
  } catch (e) {
    console.error('Failed to persist critical log:', e)
  }
}

const consoleOutput = (logEntry) => {
  const { levelName, category, message, data, stack } = logEntry
  const prefix = `[${logEntry.timestamp}] [${levelName}] [${category}]`

  const styles = {
    DEBUG: 'color: #9CA3AF',
    INFO: 'color: #3B82F6',
    WARN: 'color: #F59E0B',
    ERROR: 'color: #EF4444',
    FATAL: 'color: #EF4444; font-weight: bold'
  }

  if (import.meta.env.DEV) {
    const style = styles[levelName] || ''

    switch (levelName) {
      case 'DEBUG':
        console.debug(`%c${prefix}`, style, message, data || '')
        break
      case 'INFO':
        console.info(`%c${prefix}`, style, message, data || '')
        break
      case 'WARN':
        console.warn(`%c${prefix}`, style, message, data || '')
        break
      case 'ERROR':
      case 'FATAL':
        console.error(`%c${prefix}`, style, message, data || '')
        if (stack) console.error(stack)
        break
      default:
        console.log(`%c${prefix}`, style, message, data || '')
    }
  }
}

const createLogFunction = (level) => (category, message, data) => {
  const logEntry = formatMessage(level, category, message, data)
  addLog(logEntry)
  consoleOutput(logEntry)
  return logEntry
}

const logger = {
  // Log level methods
  debug: createLogFunction(LOG_LEVELS.DEBUG),
  info: createLogFunction(LOG_LEVELS.INFO),
  warn: createLogFunction(LOG_LEVELS.WARN),
  error: createLogFunction(LOG_LEVELS.ERROR),
  fatal: createLogFunction(LOG_LEVELS.FATAL),

  // Category shortcuts
  auth: (message, data) => createLogFunction(LOG_LEVELS.INFO)(LOG_CATEGORIES.AUTH, message, data),
  route: (message, data) => createLogFunction(LOG_LEVELS.INFO)(LOG_CATEGORIES.ROUTE, message, data),
  api: (message, data) => createLogFunction(LOG_LEVELS.INFO)(LOG_CATEGORIES.API, message, data),
  state: (message, data) => createLogFunction(LOG_LEVELS.DEBUG)(LOG_CATEGORIES.STATE, message, data),
  render: (message, data) => createLogFunction(LOG_LEVELS.DEBUG)(LOG_CATEGORIES.RENDER, message, data),
  user: (message, data) => createLogFunction(LOG_LEVELS.INFO)(LOG_CATEGORIES.USER, message, data),
  perf: (message, data) => createLogFunction(LOG_LEVELS.DEBUG)(LOG_CATEGORIES.PERFORMANCE, message, data),

  // Error logging with stack trace capture
  logError: (error, category = LOG_CATEGORIES.ERROR, context = {}) => {
    const logEntry = formatMessage(LOG_LEVELS.ERROR, category, error.message || String(error), {
      name: error.name,
      stack: error.stack,
      ...context
    })
    addLog(logEntry)
    consoleOutput(logEntry)
    return logEntry
  },

  // Performance timing
  startTimer: (label) => {
    const start = performance.now()
    return {
      end: (additionalData = {}) => {
        const duration = performance.now() - start
        logger.perf(`${label} completed`, { duration: `${duration.toFixed(2)}ms`, ...additionalData })
        return duration
      }
    }
  },

  // Group related logs
  group: (name, fn) => {
    if (import.meta.env.DEV) {
      console.group(name)
    }
    try {
      fn()
    } finally {
      if (import.meta.env.DEV) {
        console.groupEnd()
      }
    }
  },

  // Access log store
  getLogs: (filter = {}) => {
    let logs = [...logStore]

    if (filter.level !== undefined) {
      logs = logs.filter(l => l.level >= filter.level)
    }
    if (filter.category) {
      logs = logs.filter(l => l.category === filter.category)
    }
    if (filter.search) {
      const search = filter.search.toLowerCase()
      logs = logs.filter(l =>
        l.message.toLowerCase().includes(search) ||
        JSON.stringify(l.data).toLowerCase().includes(search)
      )
    }
    if (filter.limit) {
      logs = logs.slice(0, filter.limit)
    }

    return logs
  },

  // Get critical logs from localStorage
  getCriticalLogs: () => {
    try {
      return JSON.parse(localStorage.getItem('lbp_critical_logs') || '[]')
    } catch {
      return []
    }
  },

  // Clear logs
  clearLogs: () => {
    logStore.length = 0
    subscribers.forEach(callback => callback({ type: 'clear' }))
  },

  clearCriticalLogs: () => {
    localStorage.removeItem('lbp_critical_logs')
  },

  // Subscribe to new logs
  subscribe: (callback) => {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
  },

  // Export logs
  exportLogs: (format = 'json') => {
    const logs = logger.getLogs()

    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }

    if (format === 'csv') {
      const headers = 'Timestamp,Level,Category,Message,Data\n'
      const rows = logs.map(l =>
        `"${l.timestamp}","${l.levelName}","${l.category}","${l.message.replace(/"/g, '""')}","${JSON.stringify(l.data).replace(/"/g, '""')}"`
      ).join('\n')
      return headers + rows
    }

    return logs
  },

  // Constants
  LEVELS: LOG_LEVELS,
  CATEGORIES: LOG_CATEGORIES
}

// Log app initialization
logger.info(LOG_CATEGORIES.SYSTEM, 'Logger initialized', {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0'
})

export default logger
export { LOG_LEVELS, LOG_CATEGORIES }
