import { useState } from 'react'
import { Building, Truck, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SearchInput from '../common/SearchInput'
import ScoreBadge from './ScoreBadge'

export default function CarrierList({ onSelectCarrier }) {
  const { carriers } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCarriers = carriers.filter(carrier =>
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    carrier.mcNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">Carrier Scores</h1>
          <p className="text-text-secondary mt-1">{carriers.length} registered carriers</p>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search carriers..."
          className="sm:w-72"
        />
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Carrier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">MC #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Equipment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Fleet Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Total Loads</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Last Month</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">All Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarriers.map((carrier, index) => (
                <tr
                  key={carrier.id}
                  onClick={() => onSelectCarrier(carrier)}
                  className={`
                    border-b border-border last:border-0 cursor-pointer table-row
                    ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}
                  `}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-purple/20 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-accent-purple" />
                      </div>
                      <span className="text-text-primary font-medium">{carrier.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-sm">{carrier.mcNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {carrier.equipmentTypes.map(type => (
                        <span
                          key={type}
                          className="px-2 py-0.5 text-xs bg-bg-tertiary text-text-secondary rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {carrier.fleetSize}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-primary font-semibold">
                    {carrier.totalLoadsCompleted.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={carrier.lastMonthScore} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={carrier.allTimeScore} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`
                      px-2 py-0.5 text-xs rounded-full
                      ${carrier.status === 'active'
                        ? 'bg-accent-success/20 text-accent-success'
                        : 'bg-accent-danger/20 text-accent-danger'
                      }
                    `}>
                      {carrier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
