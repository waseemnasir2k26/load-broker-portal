import { useRef, useEffect } from 'react'
import logger from '../utils/logger'

/**
 * Hook to log component renders and track render performance
 * Only active in development mode
 *
 * @param {string} componentName - Name of the component being logged
 * @param {object} props - Component props to track for changes
 */
export default function useRenderLogger(componentName, props = {}) {
  const renderCount = useRef(0)
  const prevProps = useRef(props)
  const mountTime = useRef(performance.now())

  useEffect(() => {
    // Log mount
    if (import.meta.env.DEV) {
      logger.render(`${componentName} mounted`, {
        initialProps: Object.keys(props)
      })
    }

    return () => {
      // Log unmount with total render count
      if (import.meta.env.DEV) {
        const lifetimeMs = (performance.now() - mountTime.current).toFixed(2)
        logger.render(`${componentName} unmounted`, {
          totalRenders: renderCount.current,
          lifetime: `${lifetimeMs}ms`
        })
      }
    }
  }, [componentName])

  // Track renders
  renderCount.current += 1

  if (import.meta.env.DEV && renderCount.current > 1) {
    // Find changed props
    const changedProps = []
    const allKeys = new Set([...Object.keys(prevProps.current), ...Object.keys(props)])

    allKeys.forEach(key => {
      if (prevProps.current[key] !== props[key]) {
        changedProps.push({
          key,
          from: typeof prevProps.current[key],
          to: typeof props[key]
        })
      }
    })

    if (changedProps.length > 0) {
      logger.render(`${componentName} re-rendered`, {
        renderCount: renderCount.current,
        changedProps
      })
    }
  }

  prevProps.current = props

  return {
    renderCount: renderCount.current,
    isFirstRender: renderCount.current === 1
  }
}
