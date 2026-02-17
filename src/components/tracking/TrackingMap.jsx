import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { DARK_TILES, ATTRIBUTION, getCoordinates } from '../../utils/mapUtils'
import { calculateRouteProgress } from '../../utils/formatters'
import 'leaflet/dist/leaflet.css'

/**
 * GAP 10: Route Line Visualization
 * - Completed route: Solid A7 orange line
 * - Planned route: Dashed gray line
 * - Origin: Blue marker with "A"
 * - Destination: Green marker with "B"
 * - Current position: Animated pulsing orange dot
 * - Progress percentage
 */

const createLabelIcon = (label, color, bgColor = '#FFFFFF') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      background: ${bgColor};
      border: 3px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: ${color};
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

const createTruckIcon = () => {
  return L.divIcon({
    className: 'custom-marker driver-pulse',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: #FA9B00;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(250, 155, 0, 0.5);
      animation: driverPulse 1.5s infinite;
    ">
      <span style="font-size: 16px;">&#128666;</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

const originIcon = createLabelIcon('A', '#3B82F6')
const destIcon = createLabelIcon('B', '#10B981')
const truckIcon = createTruckIcon()

export default function TrackingMap({ load, tracking }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-96 skeleton rounded-xl" />
  }

  // Get coordinates
  const originCoords = load.originCoords || getCoordinates(load.origin)
  const destCoords = load.destinationCoords || getCoordinates(load.destination)
  const currentCoords = load.currentCoords || (tracking?.history?.slice(-1)[0]?.coords)

  // Build route points from tracking history
  const historyPoints = tracking?.history?.map(h => h.coords) || []
  const completedRoute = [originCoords, ...historyPoints]

  // If we have current coords, add to completed route
  if (currentCoords) {
    completedRoute.push(currentCoords)
  }

  // Planned route (remaining) - from current position to destination
  const plannedRoute = currentCoords ? [currentCoords, destCoords] : [originCoords, destCoords]

  // Calculate progress
  const progress = calculateRouteProgress(originCoords, destCoords, currentCoords || originCoords)

  // Normalize status for comparison
  const normalizedStatus = load.status?.replace('-', '_')
  const isInTransit = normalizedStatus === 'in_transit' || normalizedStatus === 'picked_up'
  const isDelivered = normalizedStatus === 'delivered' || normalizedStatus === 'closed'

  const bounds = L.latLngBounds([originCoords, destCoords, ...(currentCoords ? [currentCoords] : [])])

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Live Tracking</h3>
        {(isInTransit || isDelivered) && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-text-secondary">Route Progress:</div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FA9B00] rounded-full transition-all duration-500"
                  style={{ width: `${isDelivered ? 100 : progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-[#FA9B00]">
                {isDelivered ? 100 : progress}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url={DARK_TILES} attribution={ATTRIBUTION} />

          {/* Completed Route Line - Solid A7 Orange */}
          {completedRoute.length > 1 && (
            <Polyline
              positions={completedRoute}
              color="#FA9B00"
              weight={4}
              opacity={0.9}
            />
          )}

          {/* Planned Route Line - Dashed Gray */}
          {!isDelivered && plannedRoute.length > 1 && (
            <Polyline
              positions={plannedRoute}
              color="#475569"
              weight={3}
              opacity={0.5}
              dashArray="8 8"
            />
          )}

          {/* GPS History Points */}
          {historyPoints.map((point, index) => (
            <CircleMarker
              key={index}
              center={point}
              radius={4}
              fillColor="#FA9B00"
              fillOpacity={0.6}
              stroke={false}
            />
          ))}

          {/* Origin Marker */}
          <Marker position={originCoords} icon={originIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-blue-500">&#9398; Pickup Location</p>
                <p className="text-gray-700">{load.origin}</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={destCoords} icon={destIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-emerald-500">&#9399; Delivery Location</p>
                <p className="text-gray-700">{load.destination}</p>
              </div>
            </Popup>
          </Marker>

          {/* Current Truck Location */}
          {currentCoords && isInTransit && (
            <Marker position={currentCoords} icon={truckIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-[#FA9B00]">&#128666; Current Location</p>
                  <p className="text-gray-700">{load.currentLocation || 'En Route'}</p>
                  {load.assignedDriverId && (
                    <p className="text-gray-500 text-xs mt-1">Driver on route</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-text-secondary">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-text-secondary">Destination</span>
          </div>
          {isInTransit && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FA9B00] animate-pulse"></div>
              <span className="text-text-secondary">Current</span>
            </div>
          )}
        </div>
        {load.currentLocation && (
          <span className="text-text-primary font-medium">{load.currentLocation}</span>
        )}
      </div>
    </div>
  )
}
