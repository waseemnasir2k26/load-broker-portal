import { useState } from 'react'
import { MapPin, Package, Truck, Clock, CheckCircle, Navigation, Phone, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { formatDateTime, formatDistance, formatWeight } from '../../utils/formatters'
import StatusBadge from '../common/StatusBadge'
import Modal from '../common/Modal'

/**
 * GAP 3 & GAP 11: Driver Dashboard
 * Shows assigned load and status update buttons for drivers
 */
export default function DriverDashboard() {
  const { user } = useAuth()
  const { loads, drivers, updateShipmentStatus } = useApp()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  // Find driver's current load
  const driver = drivers.find(d => d.id === user?.driverId) || drivers[0]
  const assignedLoad = driver?.currentLoadId
    ? loads.find(l => l.id === driver.currentLoadId)
    : loads.find(l => l.assignedDriverId === user?.driverId)

  const handleStatusUpdate = (newStatus, label) => {
    setPendingAction({ status: newStatus, label })
    setShowConfirmModal(true)
  }

  const confirmStatusUpdate = () => {
    if (pendingAction && assignedLoad) {
      updateShipmentStatus(assignedLoad.id, pendingAction.status, user?.name || 'Driver')
      setShowConfirmModal(false)
      setPendingAction(null)
    }
  }

  // Calculate time since last GPS update
  const getLastUpdateTime = () => {
    if (!driver?.lastGPSUpdate) return 'Unknown'
    const lastUpdate = new Date(driver.lastGPSUpdate)
    const now = new Date()
    const diffMins = Math.floor((now - lastUpdate) / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`
  }

  // Determine which buttons are enabled based on current status
  const normalizedStatus = assignedLoad?.status?.replace('-', '_')
  const canPickUp = normalizedStatus === 'assigned'
  const canDeliver = normalizedStatus === 'picked_up' || normalizedStatus === 'in_transit'
  const isCompleted = normalizedStatus === 'delivered' || normalizedStatus === 'closed'

  if (!assignedLoad) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Welcome, {user?.name?.split(' ')[0]} <span className="text-2xl">&#128666;</span>
          </h1>
          <p className="text-text-secondary mt-1">Driver Dashboard</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Active Load</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            You don't have any loads assigned to you right now.
            Your dispatcher will assign you a load when one is available.
          </p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Your Info</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted">Truck Number</p>
              <p className="text-text-primary font-medium">{driver?.truckNumber || user?.truckNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted">CDL Number</p>
              <p className="text-text-primary font-medium font-mono">{driver?.cdlNumber || user?.cdlNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-muted">Last GPS Update</p>
              <p className="text-text-primary font-medium">{getLastUpdateTime()}</p>
            </div>
            <div>
              <p className="text-text-muted">Hours Available</p>
              <p className="text-text-primary font-medium">{driver?.hoursAvailable || 'N/A'} hrs</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Your Active Load
          </h1>
          <p className="text-text-secondary mt-1">
            {driver?.truckNumber || 'Truck'} - {user?.name}
          </p>
        </div>
        <StatusBadge status={assignedLoad.status} size="lg" pulse />
      </div>

      {/* Load Card */}
      <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
        {/* Load Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#FA9B00] font-mono">{assignedLoad.id}</h2>
              <p className="text-text-secondary text-sm mt-1">{assignedLoad.commodity}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary">
                {formatDistance(assignedLoad.distance)}
              </p>
              <p className="text-text-muted text-sm">{formatWeight(assignedLoad.weight)}</p>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-0.5 h-12 bg-border"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Pickup</p>
                <p className="text-text-primary font-semibold">{assignedLoad.origin}</p>
                <p className="text-text-secondary text-sm">{formatDateTime(assignedLoad.pickupDate)}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Delivery</p>
                <p className="text-text-primary font-semibold">{assignedLoad.destination}</p>
                <p className="text-text-secondary text-sm">{formatDateTime(assignedLoad.deliveryDate)}</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {assignedLoad.specialInstructions && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Special Instructions</p>
              <p className="text-text-primary text-sm">{assignedLoad.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Status Update Buttons - GAP 11 */}
        {!isCompleted && (
          <div className="p-6 border-t border-border bg-bg-tertiary/50">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-4">Update Status</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStatusUpdate('picked_up', 'Picked Up')}
                disabled={!canPickUp}
                className={`
                  flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all
                  ${canPickUp
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                  }
                `}
              >
                <Package className="w-5 h-5" />
                Mark as Picked Up
              </button>
              <button
                onClick={() => handleStatusUpdate('delivered', 'Delivered')}
                disabled={!canDeliver}
                className={`
                  flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all
                  ${canDeliver
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                  }
                `}
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Delivered
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-6 border-t border-border bg-emerald-500/10">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Load Completed</p>
                <p className="text-sm text-emerald-400/70">
                  Delivered on {formatDateTime(assignedLoad.deliveredAt || new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GPS Status */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FA9B00]/10 rounded-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-[#FA9B00]" />
            </div>
            <div>
              <p className="text-text-primary font-medium">GPS Location</p>
              <p className="text-text-secondary text-sm">
                {driver?.lastLocation?.city}, {driver?.lastLocation?.state}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Last Update</p>
            <p className="text-text-primary font-medium">{getLastUpdateTime()}</p>
            <p className="text-xs text-text-muted mt-1">Auto-updates every 30 min</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary hover:bg-bg-hover transition-colors">
          <Phone className="w-5 h-5" />
          Call Dispatch
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary hover:bg-bg-hover transition-colors">
          <MessageSquare className="w-5 h-5" />
          Message
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={`Confirm ${pendingAction?.label}`}
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to mark this load as <strong className="text-text-primary">{pendingAction?.label}</strong>?
          </p>
          <p className="text-sm text-text-muted">
            Load: <span className="text-[#FA9B00] font-mono">{assignedLoad.id}</span>
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-2.5 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusUpdate}
              className="flex-1 py-2.5 bg-[#FA9B00] hover:bg-[#E08A00] text-white rounded-lg font-semibold transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
