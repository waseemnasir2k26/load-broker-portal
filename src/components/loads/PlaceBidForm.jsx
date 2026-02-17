import { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export default function PlaceBidForm({ loadId }) {
  const { addBid } = useApp()
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    addBid({
      loadId,
      carrierId: user?.carrierId || 'c1',
      carrierName: user?.company || 'Your Company',
      amount: parseInt(amount),
      equipmentType: 'Dry Van',
      notes
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-bg-secondary border border-accent-success/30 rounded-xl p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-accent-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-accent-success" />
          </div>
          <p className="text-accent-success font-medium">Bid Submitted!</p>
          <p className="text-text-secondary text-sm mt-1">You'll be notified when the shipper responds.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Place Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Bid Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2,500"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Equipment details, availability, etc."
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 disabled:opacity-50 transition-colors btn-primary"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  )
}
