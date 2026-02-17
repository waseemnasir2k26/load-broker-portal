import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import logger from '../utils/logger'

/**
 * Hook to log route changes with timing and navigation patterns
 */
export default function useRouteLogger() {
  const location = useLocation()
  const prevLocation = useRef(null)
  const navigationStart = useRef(performance.now())

  useEffect(() => {
    const now = performance.now()
    const timeSinceLastNavigation = prevLocation.current
      ? (now - navigationStart.current).toFixed(2)
      : null

    logger.route('Route changed', {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      from: prevLocation.current?.pathname || 'initial',
      timeOnPreviousPage: timeSinceLastNavigation ? `${timeSinceLastNavigation}ms` : 'N/A',
      fullUrl: window.location.href
    })

    // Track page views
    logger.user('Page view', {
      page: location.pathname,
      referrer: prevLocation.current?.pathname
    })

    // Update refs for next navigation
    prevLocation.current = { ...location }
    navigationStart.current = now

    // Cleanup: log when leaving page
    return () => {
      const timeOnPage = (performance.now() - navigationStart.current).toFixed(2)
      logger.debug(logger.CATEGORIES.ROUTE, 'Leaving route', {
        path: location.pathname,
        timeOnPage: `${timeOnPage}ms`
      })
    }
  }, [location])

  return location
}
