import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

const equipmentTypes = ['Dry Van', 'Flatbed', 'Reefer']

export default function PostLoadForm({ onClose }) {
  const { addLoad } = useApp()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    origin: '',
    originZip: '',
    destination: '',
    destinationZip: '',
    pickupDate: '',
    pickupTime: '08:00',
    deliveryDate: '',
    deliveryTime: '18:00',
    equipmentType: 'Dry Van',
    weight: '',
    commodity: '',
    specialInstructions: '',
    rate: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const newLoad = {
      origin: formData.origin,
      destination: formData.destination,
      originZip: formData.originZip,
      destinationZip: formData.destinationZip,
      pickupDate: `${formData.pickupDate}T${formData.pickupTime}:00Z`,
      deliveryDate: `${formData.deliveryDate}T${formData.deliveryTime}:00Z`,
      equipmentType: formData.equipmentType,
      weight: parseInt(formData.weight) || 0,
      commodity: formData.commodity,
      specialInstructions: formData.specialInstructions,
      rate: formData.rate ? parseInt(formData.rate) : null,
      distance: Math.floor(Math.random() * 500) + 100,
      shipperId: user?.id,
      shipperCompany: user?.company
    }

    addLoad(newLoad)
    setLoading(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Origin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Origin City, State</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Chicago, IL"
            required
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Origin ZIP</label>
          <input
            type="text"
            name="originZip"
            value={formData.originZip}
            onChange={handleChange}
            placeholder="60601"
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
      </div>

      {/* Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Destination City, State</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Dallas, TX"
            required
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Destination ZIP</label>
          <input
            type="text"
            name="destinationZip"
            value={formData.destinationZip}
            onChange={handleChange}
            placeholder="75201"
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Pickup Date</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Time</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Time</label>
            <input
              type="time"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Equipment & Weight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Equipment Type</label>
          <select
            name="equipmentType"
            value={formData.equipmentType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          >
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Weight (lbs)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="42000"
            required
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Rate ($) - Optional</label>
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="Open for bidding"
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
          />
        </div>
      </div>

      {/* Commodity */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Commodity Description</label>
        <input
          type="text"
          name="commodity"
          value={formData.commodity}
          onChange={handleChange}
          placeholder="Packaged goods, electronics, etc."
          required
          className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
        />
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Special Instructions</label>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          rows={3}
          placeholder="Any special handling requirements..."
          className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 disabled:opacity-50 transition-colors btn-primary"
        >
          {loading ? 'Posting...' : 'Post Load'}
        </button>
      </div>
    </form>
  )
}
