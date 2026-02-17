import { Check, X, Building } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../common/StatusBadge'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

export default function BidsList({ loadId, bids, loadStatus }) {
  const { acceptBid, getCarrierById } = useApp()
  const { currentRole } = useAuth()

  const canAcceptBids = ['dispatch', 'admin'].includes(currentRole) && loadStatus === 'bidding'

  const handleAccept = (bidId) => {
    acceptBid(bidId, loadId)
  }

  if (bids.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center">
        <p className="text-text-secondary">No bids received yet</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-tertiary/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Carrier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Bid Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Equipment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Notes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
              {canAcceptBids && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => {
              const carrier = getCarrierById(bid.carrierId)
              return (
                <tr
                  key={bid.id}
                  className={`
                    border-b border-border last:border-0
                    ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}
                  `}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-purple/20 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-accent-purple" />
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{bid.carrierName}</p>
                        <p className="text-xs text-text-muted font-mono">{carrier?.mcNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      carrier?.averageScore >= 90 ? 'text-accent-success' :
                      carrier?.averageScore >= 70 ? 'text-accent-warning' : 'text-accent-danger'
                    }`}>
                      {carrier?.averageScore || '-'}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-accent-success font-semibold font-mono">
                      {formatCurrency(bid.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{bid.equipmentType}</td>
                  <td className="px-4 py-3 text-text-secondary text-sm max-w-xs truncate">{bid.notes}</td>
                  <td className="px-4 py-3 text-text-muted text-sm">{formatDateTime(bid.timestamp)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={bid.status} />
                  </td>
                  {canAcceptBids && (
                    <td className="px-4 py-3">
                      {bid.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(bid.id)}
                            className="p-1.5 bg-accent-success/20 text-accent-success rounded hover:bg-accent-success/30 transition-colors"
                            title="Accept Bid"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 bg-accent-danger/20 text-accent-danger rounded hover:bg-accent-danger/30 transition-colors"
                            title="Reject Bid"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
