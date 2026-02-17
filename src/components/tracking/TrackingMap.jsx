import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { DARK_TILES, ATTRIBUTION, getCoordinates } from '../../utils/mapUtils'
import 'leaflet/dist/leaflet.css'

const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const originIcon = createIcon('#10B981')
const destIcon = createIcon('#EF4444')
const truckIcon = createIcon('#F59E0B')

export default function TrackingMap({ load, tracking }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-96 skeleton rounded-xl" />
  }

  const originCoords = getCoordinates(load.origin)
  const destCoords = getCoordinates(load.destination)
  const currentCoords = load.currentCoords || (tracking?.history?.slice(-1)[0]?.coords)

  const routePoints = tracking?.history?.map(h => h.coords) || [originCoords, destCoords]
  const bounds = L.latLngBounds([originCoords, destCoords, ...(currentCoords ? [currentCoords] : [])])

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Live Tracking</h3>
      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [50, 50] }}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url={DARK_TILES} attribution={ATTRIBUTION} />

          {/* Route Line */}
          <Polyline
            positions={routePoints}
            color="#3B82F6"
            weight={3}
            opacity={0.8}
          />

          {/* Origin Marker */}
          <Marker position={originCoords} icon={originIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Pickup</p>
                <p>{load.origin}</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={destCoords} icon={destIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Delivery</p>
                <p>{load.destination}</p>
              </div>
            </Popup>
          </Marker>

          {/* Current Location */}
          {currentCoords && load.status === 'in-transit' && (
            <Marker position={currentCoords} icon={truckIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Current Location</p>
                  <p>{load.currentLocation || 'En Route'}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      {load.currentLocation && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-text-secondary">Current Location:</span>
          <span className="text-text-primary font-medium">{load.currentLocation}</span>
        </div>
      )}
    </div>
  )
}
