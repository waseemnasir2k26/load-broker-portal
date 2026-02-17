import { useState } from 'react'
import { AlertCircle, X, ExternalLink } from 'lucide-react'

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)

  // Check if this is a demo session
  const isDemoMode = localStorage.getItem('lbp_demo_mode') === 'true'

  if (!isDemoMode || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-200">
            <span className="font-medium">Demo Mode:</span>{' '}
            You're exploring with sample data. Changes won't be saved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/guide"
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 transition-colors"
          >
            View Guide
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-400 hover:text-amber-200 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
