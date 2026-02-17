import { useState } from 'react'
import { Truck, User, Clock, MapPin, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

/**
 * GAP 6: Assign Driver Modal
 * Allows carriers to assign one of their fleet drivers to an accepted load
 */
export default function AssignDriverModal({ isOpen, onClose, load }) {
  const { user } = useAuth()
  const { drivers, assignDriver } = useApp()
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [isAssigning, setIsAssigning] = useState(false)

  // Get drivers for this carrier
  const carrierDrivers = drivers.filter(d =>
    d.carrierId === user?.carrierId || d.carrierId === 'carrier_001'
  )

  // Filter to available drivers only
  const availableDrivers = carrierDrivers.filter(d =>
    d.status === 'available' || !d.currentLoadId
  )

  const handleAssign = async () => {
    if (!selectedDriverId || !load) return

    setIsAssigning(true)

    // Simulate API call
    setTimeout(() => {
      assignDriver(load.id, selectedDriverId, user?.company || 'Carrier')
      setIsAssigning(false)
      setSelectedDriverId(null)
      onClose()
    }, 500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Driver to ${load?.id || 'Load'}`}
    >
      <div className="space-y-4">
        {/* Load Summary */}
        <div className="bg-bg-tertiary rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
            <MapPin className="w-4 h-4" />
            <span>{load?.origin}</span>
            <span className="text-text-muted">→</span>
            <span>{load?.destination}</span>
          </div>
          <p className="text-xs text-text-muted">
            {load?.equipmentType} • {load?.weight?.toLocaleString()} lbs • {load?.distance} mi
          </p>
        </div>

        {/* Driver Selection */}
        <div>
          <p className="text-sm text-text-secondary mb-3">Select a driver from your fleet:</p>

          {availableDrivers.length === 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
              <p className="text-amber-400 text-sm">
                No available drivers. All drivers are currently assigned to loads.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableDrivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriverId(driver.id)}
                  className={`
                    w-full p-4 rounded-xl border text-left transition-all
                    ${selectedDriverId === driver.id
                      ? 'bg-[#FA9B00]/10 border-[#FA9B00] ring-1 ring-[#FA9B00]'
                      : 'bg-bg-tertiary border-border hover:border-text-muted'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${selectedDriverId === driver.id ? 'bg-[#FA9B00]/20' : 'bg-bg-hover'}
                    `}>
                      <User className={`w-6 h-6 ${selectedDriverId === driver.id ? 'text-[#FA9B00]' : 'text-text-muted'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">{driver.name}</span>
                        {selectedDriverId === driver.id && (
                          <CheckCircle className="w-4 h-4 text-[#FA9B00]" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {driver.truckNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {driver.hoursAvailable}h available
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${driver.status === 'available'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                        }
                      `}>
                        {driver.status === 'available' ? 'Available' : 'Busy'}
                      </div>
                      {driver.rating && (
                        <div className="text-xs text-text-muted mt-1">
                          &#9733; {driver.rating}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedDriverId || isAssigning}
            className={`
              flex-1 py-2.5 rounded-lg font-semibold transition-all
              ${selectedDriverId && !isAssigning
                ? 'bg-[#FA9B00] hover:bg-[#E08A00] text-white'
                : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
              }
            `}
          >
            {isAssigning ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Assigning...
              </span>
            ) : (
              'Assign Driver'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
