import { useState } from 'react'
import CarrierList from '../components/carriers/CarrierList'
import CarrierProfile from '../components/carriers/CarrierProfile'

export default function CarrierScoresPage() {
  const [selectedCarrier, setSelectedCarrier] = useState(null)

  if (selectedCarrier) {
    return (
      <CarrierProfile
        carrier={selectedCarrier}
        onBack={() => setSelectedCarrier(null)}
      />
    )
  }

  return <CarrierList onSelectCarrier={setSelectedCarrier} />
}
