import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import SearchInput from '../components/common/SearchInput'
import FilterBar from '../components/common/FilterBar'
import StatusBadge from '../components/common/StatusBadge'
import DataTable from '../components/common/DataTable'
import { formatCurrency, formatDate, formatDistance } from '../utils/formatters'

const filters = [
  {
    key: 'status',
    label: 'All Status',
    options: [
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
  }
]

export default function ShipmentHistoryPage() {
  const navigate = useNavigate()
  const { loads, getCarrierById } = useApp()
  const { currentRole } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({ status: 'all' })

  const historyLoads = useMemo(() => {
    return loads
      .filter(load => load.status === 'delivered' || load.status === 'cancelled')
      .filter(load => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            load.id.toLowerCase().includes(query) ||
            load.origin.toLowerCase().includes(query) ||
            load.destination.toLowerCase().includes(query)
          )
        }
        return true
      })
      .filter(load => {
        if (activeFilters.status !== 'all') {
          return load.status === activeFilters.status
        }
        return true
      })
      .sort((a, b) => new Date(b.deliveredDate || b.postedDate) - new Date(a.deliveredDate || a.postedDate))
  }, [loads, searchQuery, activeFilters])

  const handleExportCSV = () => {
    const headers = ['Shipment #', 'Origin', 'Destination', 'Status', 'Carrier', 'Score', 'Date', 'Rate']
    const rows = historyLoads.map(load => {
      const carrier = getCarrierById(load.assignedCarrierId)
      return [
        load.id,
        load.origin,
        load.destination,
        load.status,
        carrier?.name || 'N/A',
        load.score || 'N/A',
        formatDate(load.deliveredDate || load.postedDate),
        load.rate || 'N/A'
      ]
    })

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shipment-history-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const columns = [
    {
      key: 'id',
      label: 'Shipment #',
      render: (value) => <span className="text-accent-primary font-mono font-semibold">{value}</span>
    },
    {
      key: 'origin',
      label: 'Route',
      render: (_, row) => (
        <span className="text-text-primary">
          {row.origin} <span className="text-text-muted">→</span> {row.destination}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'assignedCarrierId',
      label: 'Carrier',
      render: (value) => {
        const carrier = getCarrierById(value)
        return <span className="text-text-secondary">{carrier?.name || 'N/A'}</span>
      }
    },
    {
      key: 'score',
      label: 'Score',
      render: (value) => (
        <span className={`font-semibold ${
          value >= 90 ? 'text-accent-success' :
          value >= 70 ? 'text-accent-warning' : 'text-accent-danger'
        }`}>
          {value ? `${value}%` : '-'}
        </span>
      )
    },
    {
      key: 'deliveredDate',
      label: 'Date',
      render: (value, row) => (
        <span className="text-text-secondary text-sm">
          {formatDate(value || row.postedDate)}
        </span>
      )
    },
    {
      key: 'rate',
      label: 'Rate',
      render: (value) => (
        <span className="text-accent-success font-semibold font-mono">
          {value ? formatCurrency(value) : '-'}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Shipment History</h1>
          <p className="text-text-secondary mt-1">
            {historyLoads.length} completed shipments
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2.5 bg-bg-tertiary border border-border text-text-primary rounded-lg font-medium hover:bg-bg-hover transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ID, origin, destination..."
          className="lg:w-80"
        />
        <FilterBar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={(key, value) => setActiveFilters(prev => ({ ...prev, [key]: value }))}
          onClearAll={() => setActiveFilters({ status: 'all' })}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={historyLoads}
        onRowClick={(row) => navigate(`/loads/${row.id}`)}
        emptyMessage="No shipment history found"
      />
    </div>
  )
}
