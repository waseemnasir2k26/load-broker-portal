import StatusBadge from '../common/StatusBadge'
import { formatCurrency, formatDistance, formatWeight } from '../../utils/formatters'

export default function LoadRow({ load, onClick, index = 0 }) {
  return (
    <tr
      onClick={onClick}
      className={`
        border-b border-border last:border-0 cursor-pointer table-row
        ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'}
      `}
    >
      <td className="px-4 py-3">
        <span className="text-accent-primary font-mono font-semibold">{load.id}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center">
          <span className="text-text-primary">{load.origin}</span>
          <span className="mx-2 text-text-muted">→</span>
          <span className="text-text-primary">{load.destination}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-text-secondary">{load.equipmentType}</td>
      <td className="px-4 py-3 text-text-secondary font-mono text-sm">{formatWeight(load.weight)}</td>
      <td className="px-4 py-3 text-text-secondary font-mono text-sm">{formatDistance(load.distance)}</td>
      <td className="px-4 py-3">
        <span className={`font-semibold font-mono ${load.rate ? 'text-accent-success' : 'text-accent-purple'}`}>
          {load.rate ? formatCurrency(load.rate) : 'Open'}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={load.status} pulse={load.status === 'in-transit'} />
      </td>
      <td className="px-4 py-3">
        {load.bidsCount > 0 && (
          <span className="text-accent-purple text-sm font-medium">
            {load.bidsCount}
          </span>
        )}
      </td>
    </tr>
  )
}
