import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, Scale, Route, DollarSign, Clock, Building } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../common/StatusBadge'
import BidsList from './BidsList'
import PlaceBidForm from './PlaceBidForm'
import TrackingMap from '../tracking/TrackingMap'
import TrackingTimeline from '../tracking/TrackingTimeline'
import MessageThread from '../messages/MessageThread'
import { formatCurrency, formatDistance, formatWeight, formatDate, formatDateTime } from '../../utils/formatters'
import trackingHistory from '../../data/trackingHistory.json'

export default function LoadDetail({ loadId }) {
  const navigate = useNavigate()
  const { getLoadById, getBidsForLoad, getCarrierById, getMessagesForLoad } = useApp()
  const { currentRole } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const load = getLoadById(loadId)
  const bids = getBidsForLoad(loadId)
  const carrier = load?.assignedCarrierId ? getCarrierById(load.assignedCarrierId) : null
  const messages = getMessagesForLoad(loadId)
  const tracking = trackingHistory.find(t => t.loadId === loadId)

  if (!load) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Load not found</p>
        <button
          onClick={() => navigate('/loads')}
          className="mt-4 text-accent-primary hover:underline"
        >
          Back to Load Board
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bids', label: `Bids (${bids.length})`, show: ['dispatch', 'admin', 'carrier'].includes(currentRole) },
    { id: 'tracking', label: 'Tracking', show: ['assigned', 'in-transit', 'delivered'].includes(load.status) },
    { id: 'messages', label: 'Messages' },
    { id: 'history', label: 'History' }
  ].filter(tab => tab.show !== false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/loads')}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-accent-primary font-mono">{load.id}</h1>
              <StatusBadge status={load.status} size="lg" pulse={load.status === 'in-transit'} />
            </div>
            <p className="text-text-secondary mt-1">
              Posted by {load.shipperCompany} on {formatDate(load.postedDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.id
                ? 'text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-up">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Route */}
              <div className="bg-bg-secondary border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Route Details</h3>
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-accent-success" />
                    <div className="w-0.5 h-16 bg-border my-2" />
                    <div className="w-3 h-3 rounded-full bg-accent-danger" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <p className="text-sm text-text-muted">Pickup</p>
                      <p className="text-lg font-medium text-text-primary">{load.origin}</p>
                      <p className="text-sm text-text-secondary">{formatDateTime(load.pickupDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Delivery</p>
                      <p className="text-lg font-medium text-text-primary">{load.destination}</p>
                      <p className="text-sm text-text-secondary">{formatDateTime(load.deliveryDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-bg-secondary border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Shipment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-text-muted flex items-center"><Package className="w-4 h-4 mr-1" /> Equipment</p>
                    <p className="text-text-primary font-medium">{load.equipmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted flex items-center"><Scale className="w-4 h-4 mr-1" /> Weight</p>
                    <p className="text-text-primary font-medium">{formatWeight(load.weight)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted flex items-center"><Route className="w-4 h-4 mr-1" /> Distance</p>
                    <p className="text-text-primary font-medium">{formatDistance(load.distance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted flex items-center"><DollarSign className="w-4 h-4 mr-1" /> Rate</p>
                    <p className="text-accent-success font-semibold">
                      {load.rate ? formatCurrency(load.rate) : 'Open for Bidding'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-text-muted">Commodity</p>
                  <p className="text-text-primary">{load.commodity}</p>
                </div>
                {load.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-text-muted">Special Instructions</p>
                    <p className="text-text-primary">{load.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assigned Carrier */}
              {carrier && (
                <div className="bg-bg-secondary border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Assigned Carrier</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-accent-purple" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{carrier.name}</p>
                      <p className="text-sm text-text-muted font-mono">{carrier.mcNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Carrier Score</span>
                      <span className={`font-semibold ${carrier.averageScore >= 90 ? 'text-accent-success' : 'text-accent-warning'}`}>
                        {carrier.averageScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Place Bid (for carriers) */}
              {currentRole === 'carrier' && ['posted', 'bidding'].includes(load.status) && (
                <PlaceBidForm loadId={loadId} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'bids' && (
          <BidsList loadId={loadId} bids={bids} loadStatus={load.status} />
        )}

        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrackingMap load={load} tracking={tracking} />
            <TrackingTimeline tracking={tracking} />
          </div>
        )}

        {activeTab === 'messages' && (
          <MessageThread loadId={loadId} messages={messages} />
        )}

        {activeTab === 'history' && (
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Audit Log</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-primary mt-2" />
                <div>
                  <p className="text-text-primary">Load Posted</p>
                  <p className="text-sm text-text-muted">{formatDateTime(load.postedDate)}</p>
                </div>
              </div>
              {load.status !== 'posted' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-purple mt-2" />
                  <div>
                    <p className="text-text-primary">Bids received</p>
                    <p className="text-sm text-text-muted">{bids.length} total bids</p>
                  </div>
                </div>
              )}
              {carrier && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-success mt-2" />
                  <div>
                    <p className="text-text-primary">Bid accepted - {carrier.name}</p>
                    <p className="text-sm text-text-muted">Assigned to carrier</p>
                  </div>
                </div>
              )}
              {load.status === 'delivered' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-success mt-2" />
                  <div>
                    <p className="text-text-primary">Delivered</p>
                    <p className="text-sm text-text-muted">{formatDateTime(load.deliveredDate)} - Score: {load.score}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
