import { formatCurrency, formatDate, formatWeight, formatDistance } from '../../utils/formatters'

export default function ContractPreview({ load, carrier }) {
  if (!load || !carrier) {
    return null
  }

  return (
    <div className="bg-white text-gray-900 rounded-lg p-8 font-serif">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">FREIGHT TRANSPORTATION CONTRACT</h1>
        <p className="text-gray-600 mt-2">Contract Reference: CTR-{load.id}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-bold text-lg mb-2 border-b pb-1">SHIPPER</h2>
          <p className="font-semibold">{load.shipperCompany}</p>
          <p className="text-gray-600">Load Ref: {load.id}</p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-2 border-b pb-1">CARRIER</h2>
          <p className="font-semibold">{carrier.name}</p>
          <p className="text-gray-600">{carrier.mcNumber}</p>
          <p className="text-gray-600">{carrier.email}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-3 border-b pb-1">SHIPMENT DETAILS</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Origin</p>
            <p className="font-semibold">{load.origin}</p>
            <p className="text-sm text-gray-500">{formatDate(load.pickupDate)}</p>
          </div>
          <div>
            <p className="text-gray-600">Destination</p>
            <p className="font-semibold">{load.destination}</p>
            <p className="text-sm text-gray-500">{formatDate(load.deliveryDate)}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-gray-600">Equipment</p>
            <p className="font-semibold">{load.equipmentType}</p>
          </div>
          <div>
            <p className="text-gray-600">Weight</p>
            <p className="font-semibold">{formatWeight(load.weight)}</p>
          </div>
          <div>
            <p className="text-gray-600">Distance</p>
            <p className="font-semibold">{formatDistance(load.distance)}</p>
          </div>
          <div>
            <p className="text-gray-600">Rate</p>
            <p className="font-semibold text-green-600">{formatCurrency(load.rate)}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-lg mb-3 border-b pb-1">COMMODITY</h2>
        <p>{load.commodity}</p>
        {load.specialInstructions && (
          <p className="mt-2 text-gray-600 italic">{load.specialInstructions}</p>
        )}
      </div>

      <div className="border-t pt-8 mt-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="mb-8">Shipper Signature:</p>
            <div className="border-b border-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Date: _______________</p>
          </div>
          <div>
            <p className="mb-8">Carrier Signature:</p>
            <div className="border-b border-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  )
}
