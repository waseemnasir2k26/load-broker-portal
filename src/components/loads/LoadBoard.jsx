import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Grid, List, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import SearchInput from '../common/SearchInput'
import FilterBar from '../common/FilterBar'
import LoadCard from './LoadCard'
import LoadRow from './LoadRow'
import PostLoadForm from './PostLoadForm'
import Modal from '../common/Modal'
import EmptyState from '../common/EmptyState'

const filters = [
  {
    key: 'status',
    label: 'All Status',
    options: [
      { value: 'posted', label: 'Posted' },
      { value: 'bidding', label: 'Bidding' },
      { value: 'assigned', label: 'Assigned' },
      { value: 'in-transit', label: 'In Transit' },
      { value: 'delivered', label: 'Delivered' }
    ]
  },
  {
    key: 'equipmentType',
    label: 'All Equipment',
    options: [
      { value: 'Dry Van', label: 'Dry Van' },
      { value: 'Flatbed', label: 'Flatbed' },
      { value: 'Reefer', label: 'Reefer' }
    ]
  }
]

export default function LoadBoard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loads } = useApp()
  const { currentRole } = useAuth()

  const [viewMode, setViewMode] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({
    status: searchParams.get('status') || 'all',
    equipmentType: 'all'
  })
  const [showPostModal, setShowPostModal] = useState(searchParams.get('action') === 'new')

  const canPostLoads = ['customer', 'dispatch', 'admin'].includes(currentRole)

  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      if (searchQuery && !load.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !load.origin.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !load.destination.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (activeFilters.status !== 'all' && load.status !== activeFilters.status) {
        return false
      }
      if (activeFilters.equipmentType !== 'all' && load.equipmentType !== activeFilters.equipmentType) {
        return false
      }
      return true
    })
  }, [loads, searchQuery, activeFilters])

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setActiveFilters({ status: 'all', equipmentType: 'all' })
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Load Board</h1>
          <p className="text-text-secondary mt-1">
            {filteredLoads.length} loads available
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canPostLoads && (
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center px-4 py-2.5 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post Load
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ID, origin, destination..."
          className="lg:w-80"
        />
        <div className="flex-1">
          <FilterBar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
          />
        </div>
        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Load List/Grid */}
      {filteredLoads.length === 0 ? (
        <EmptyState
          type="loads"
          title="No loads found"
          description="Try adjusting your filters or search query."
          action={handleClearFilters}
          actionLabel="Clear Filters"
        />
      ) : viewMode === 'list' ? (
        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-tertiary/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Shipment #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Equipment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Weight</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Bids</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoads.map((load, index) => (
                  <LoadRow
                    key={load.id}
                    load={load}
                    onClick={() => navigate(`/loads/${load.id}`)}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLoads.map((load, index) => (
            <LoadCard
              key={load.id}
              load={load}
              onClick={() => navigate(`/loads/${load.id}`)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Post Load Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Post New Load"
        size="lg"
      >
        <PostLoadForm onClose={() => setShowPostModal(false)} />
      </Modal>
    </div>
  )
}
