import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const truckIcon = L.divIcon({
  className: 'truck-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #F59E0B;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
        <path d="M19 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
        <path d="M5 17H3v-5l2-4h6v9m6 0H9"/>
        <path d="M15 8h4l3 4v5h-2"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

export default function DriverPin({ position, location, shipmentId }) {
  return (
    <Marker position={position} icon={truckIcon}>
      <Popup>
        <div className="text-sm">
          <p className="font-semibold font-mono">{shipmentId}</p>
          <p className="text-gray-600">{location}</p>
          <p className="text-xs text-gray-400 mt-1">In Transit</p>
        </div>
      </Popup>
    </Marker>
  )
}
