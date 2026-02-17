import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { DARK_TILES, ATTRIBUTION, US_CENTER } from '../../utils/mapUtils'
import { useApp } from '../../context/AppContext'
import 'leaflet/dist/leaflet.css'

export default function MiniMap() {
  const { loads } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const inTransitLoads = loads.filter(l => l.status === 'in-transit' && l.currentCoords)

  const getMarkerColor = (load) => {
    return '#F59E0B'
  }

  if (!mounted) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-5 animate-fade-up">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Active Shipments</h3>
        <div className="h-64 skeleton rounded-lg" />
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5 animate-fade-up">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Active Shipments
        <span className="ml-2 text-sm font-normal text-text-secondary">
          ({inTransitLoads.length} in transit)
        </span>
      </h3>
      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={US_CENTER}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url={DARK_TILES} attribution={ATTRIBUTION} />
          {inTransitLoads.map((load) => (
            <CircleMarker
              key={load.id}
              center={load.currentCoords}
              radius={8}
              fillColor={getMarkerColor(load)}
              fillOpacity={0.8}
              stroke={true}
              color="#fff"
              weight={2}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold font-mono">{load.id}</p>
                  <p className="text-gray-600">{load.currentLocation}</p>
                  <p className="text-gray-500">{load.origin} → {load.destination}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
