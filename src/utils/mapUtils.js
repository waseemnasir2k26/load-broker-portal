export const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const US_CENTER = [39.8283, -98.5795]
export const DEFAULT_ZOOM = 4

export const cityCoordinates = {
  'Chicago, IL': [41.8781, -87.6298],
  'Dallas, TX': [32.7767, -96.7970],
  'Los Angeles, CA': [34.0522, -118.2437],
  'Miami, FL': [25.7617, -80.1918],
  'New York, NY': [40.7128, -74.0060],
  'Atlanta, GA': [33.7490, -84.3880],
  'Houston, TX': [29.7604, -95.3698],
  'Phoenix, AZ': [33.4484, -112.0740],
  'Denver, CO': [39.7392, -104.9903],
  'Seattle, WA': [47.6062, -122.3321],
  'Detroit, MI': [42.3314, -83.0458],
  'Minneapolis, MN': [44.9778, -93.2650],
  'St. Louis, MO': [38.6270, -90.1994],
  'Kansas City, MO': [39.0997, -94.5786],
  'Nashville, TN': [36.1627, -86.7816],
  'Indianapolis, IN': [39.7684, -86.1581],
  'Columbus, OH': [39.9612, -82.9988],
  'Charlotte, NC': [35.2271, -80.8431],
  'Memphis, TN': [35.1495, -90.0490],
  'Oklahoma City, OK': [35.4676, -97.5164],
  'Louisville, KY': [38.2527, -85.7585],
  'Baltimore, MD': [39.2904, -76.6122],
  'Milwaukee, WI': [43.0389, -87.9065],
  'Albuquerque, NM': [35.0844, -106.6504],
  'Tucson, AZ': [32.2226, -110.9747],
  'Fresno, CA': [36.7378, -119.7871],
  'Sacramento, CA': [38.5816, -121.4944],
  'Portland, OR': [45.5152, -122.6784],
  'Las Vegas, NV': [36.1699, -115.1398],
  'San Antonio, TX': [29.4241, -98.4936],
  'Springfield, IL': [39.7817, -89.6501],
  'Joliet, IL': [41.5250, -88.0817],
  'Cleveland, OH': [41.4993, -81.6944],
  'Pittsburgh, PA': [40.4406, -79.9959],
  'Philadelphia, PA': [39.9526, -75.1652],
  'Boston, MA': [42.3601, -71.0589],
  'San Francisco, CA': [37.7749, -122.4194],
  'San Diego, CA': [32.7157, -117.1611],
  'El Paso, TX': [31.7619, -106.4850],
  'Austin, TX': [30.2672, -97.7431],
  'Jacksonville, FL': [30.3322, -81.6557],
  'Tampa, FL': [27.9506, -82.4572],
  'Orlando, FL': [28.5383, -81.3792],
  'New Orleans, LA': [29.9511, -90.0715],
  'Omaha, NE': [41.2565, -95.9345],
  'Tulsa, OK': [36.1540, -95.9928],
  'Salt Lake City, UT': [40.7608, -111.8910],
  'Boise, ID': [43.6150, -116.2023],
  'Reno, NV': [39.5296, -119.8138]
}

export function getCoordinates(city) {
  return cityCoordinates[city] || US_CENTER
}

export function calculateRoute(origin, destination) {
  const originCoords = getCoordinates(origin)
  const destCoords = getCoordinates(destination)
  return [originCoords, destCoords]
}

export function calculateDistance(origin, destination) {
  const [lat1, lon1] = getCoordinates(origin)
  const [lat2, lon2] = getCoordinates(destination)

  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c)
}

export function generateIntermediatePoints(origin, destination, numPoints = 5) {
  const originCoords = getCoordinates(origin)
  const destCoords = getCoordinates(destination)
  const points = []

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const lat = originCoords[0] + t * (destCoords[0] - originCoords[0])
    const lng = originCoords[1] + t * (destCoords[1] - originCoords[1])
    points.push([lat, lng])
  }

  return points
}

export function getStatusMarkerColor(status) {
  switch (status) {
    case 'delivered': return '#10B981'
    case 'in-transit': return '#F59E0B'
    case 'assigned': return '#3B82F6'
    case 'delayed': return '#EF4444'
    default: return '#6B7280'
  }
}
