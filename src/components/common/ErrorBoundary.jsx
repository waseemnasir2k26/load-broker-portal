import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import logger from '../../utils/logger'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `err_${Date.now()}`

    // Log the error with full context
    logger.fatal(logger.CATEGORIES.ERROR, `Component Error: ${error.message}`, {
      errorId,
      componentStack: errorInfo.componentStack,
      errorName: error.name,
      errorStack: error.stack,
      boundaryName: this.props.name || 'UnnamedBoundary',
      url: window.location.href
    })

    this.setState({
      error,
      errorInfo,
      errorId
    })

    // Call optional error handler prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    logger.info(logger.CATEGORIES.USER, 'Error boundary retry clicked', {
      errorId: this.state.errorId
    })
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    logger.info(logger.CATEGORIES.USER, 'Error boundary go home clicked', {
      errorId: this.state.errorId
    })
    window.location.href = '/'
  }

  handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state
    const reportData = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }

    // Copy error report to clipboard
    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2))
      .then(() => {
        alert('Error report copied to clipboard!')
      })
      .catch(() => {
        console.log('Error report:', reportData)
        alert('Check console for error report')
      })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          retry: this.handleRetry
        })
      }

      // Minimal fallback for inline errors
      if (this.props.minimal) {
        return (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Something went wrong</span>
            <button
              onClick={this.handleRetry}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )
      }

      // Full error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-bg-secondary border border-red-500/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-text-primary mb-2">
              Something went wrong
            </h2>

            <p className="text-text-secondary text-sm mb-4">
              {this.props.message || "We encountered an unexpected error. Please try again."}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="text-left mb-4 p-3 bg-bg-tertiary rounded-lg overflow-x-auto">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <p className="text-xs text-text-muted mb-4">
              Error ID: {this.state.errorId}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-tertiary text-text-primary rounded-lg hover:bg-border transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            <button
              onClick={this.handleReportBug}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              <Bug className="w-4 h-4" />
              Copy Error Report
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
