import { useState } from 'react'
import { Search, Package, MapPin, Truck, Clock, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import StatusBadge from '../common/StatusBadge'
import TrackingMap from './TrackingMap'
import TrackingTimeline from './TrackingTimeline'
import { formatDateTime, formatDistance } from '../../utils/formatters'
import trackingHistory from '../../data/trackingHistory.json'

export default function TrackingSearch() {
  const { getLoadById } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedLoad, setSearchedLoad] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    setError('')

    if (!searchQuery.trim()) {
      setError('Please enter a shipment number')
      return
    }

    const load = getLoadById(searchQuery.trim().toUpperCase())
    if (load) {
      setSearchedLoad(load)
    } else {
      setError('Shipment not found. Please check the number and try again.')
      setSearchedLoad(null)
    }
  }

  const tracking = searchedLoad ? trackingHistory.find(t => t.loadId === searchedLoad.id) : null

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-accent-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Track Your Shipment</h2>
          <p className="text-text-secondary mt-1">Enter your shipment number to see real-time status</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter shipment # (e.g., SH-4815)"
              className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-accent-primary"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors btn-primary"
          >
            Track
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-accent-danger">{error}</p>
        )}

        <p className="mt-4 text-center text-xs text-text-muted">
          Try: SH-4815, SH-4812, SH-4811, SH-4810
        </p>
      </div>

      {/* Search Results */}
      {searchedLoad && (
        <div className="animate-fade-up space-y-6">
          {/* Status Overview */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent-primary/20 rounded-lg">
                  <Truck className="w-8 h-8 text-accent-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-accent-primary font-mono">{searchedLoad.id}</h2>
                    <StatusBadge status={searchedLoad.status} size="lg" pulse={searchedLoad.status === 'in-transit'} />
                  </div>
                  <p className="text-text-secondary mt-1">{searchedLoad.commodity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:text-right">
                <div>
                  <p className="text-xs text-text-muted">Distance</p>
                  <p className="text-text-primary font-semibold">{formatDistance(searchedLoad.distance)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Equipment</p>
                  <p className="text-text-primary font-semibold">{searchedLoad.equipmentType}</p>
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-accent-success" />
                  <div className="w-0.5 h-12 bg-border my-2" />
                  <div className="w-3 h-3 rounded-full bg-accent-danger" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-text-muted flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Pickup
                    </p>
                    <p className="text-text-primary font-medium">{searchedLoad.origin}</p>
                    <p className="text-sm text-text-secondary">{formatDateTime(searchedLoad.pickupDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> Delivery
                    </p>
                    <p className="text-text-primary font-medium">{searchedLoad.destination}</p>
                    <p className="text-sm text-text-secondary">{formatDateTime(searchedLoad.deliveryDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrackingMap load={searchedLoad} tracking={tracking} />
            <TrackingTimeline tracking={tracking} />
          </div>
        </div>
      )}
    </div>
  )
}
