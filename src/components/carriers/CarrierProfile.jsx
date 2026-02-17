import { ArrowLeft, Building, Truck, Phone, Mail, MapPin, Shield, Calendar } from 'lucide-react'
import ScoreChart from './ScoreChart'
import ScoreBadge from './ScoreBadge'
import { formatDate } from '../../utils/formatters'

export default function CarrierProfile({ carrier, onBack }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">{carrier.name}</h1>
          <p className="text-text-secondary font-mono">{carrier.mcNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Overview */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Score</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-sm text-text-muted mb-1">Last Month</p>
                <ScoreBadge score={carrier.lastMonthScore} size="lg" />
              </div>
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-sm text-text-muted mb-1">Average</p>
                <ScoreBadge score={carrier.averageScore} size="lg" />
              </div>
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-sm text-text-muted mb-1">All Time</p>
                <ScoreBadge score={carrier.allTimeScore} size="lg" />
              </div>
            </div>
            <ScoreChart scoreHistory={carrier.scoreHistory} />
          </div>

          {/* Score History Table */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Month</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-text-secondary uppercase">Loads Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {carrier.scoreHistory.map((entry, index) => (
                    <tr key={entry.month} className={index % 2 === 0 ? 'bg-slate-800/30' : ''}>
                      <td className="px-4 py-2 text-text-primary">{entry.month}</td>
                      <td className="px-4 py-2">
                        <ScoreBadge score={entry.score} />
                      </td>
                      <td className="px-4 py-2 text-text-secondary">{entry.loads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-accent-purple/20 rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-accent-purple" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">{carrier.name}</p>
                <p className="text-sm text-text-muted">{carrier.yearsInBusiness} years in business</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-text-muted" />
                <span className="text-text-primary">{carrier.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-text-primary">{carrier.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-text-muted" />
                <span className="text-text-primary">{carrier.address}</span>
              </div>
            </div>
          </div>

          {/* Fleet & Insurance */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h4 className="font-semibold text-text-primary mb-4">Fleet Information</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Fleet Size
                </span>
                <span className="text-text-primary font-semibold">{carrier.fleetSize} trucks</span>
              </div>
              <div>
                <p className="text-text-secondary mb-2">Equipment Types</p>
                <div className="flex flex-wrap gap-2">
                  {carrier.equipmentTypes.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 text-sm bg-bg-tertiary text-text-primary rounded-lg"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-text-secondary flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Insurance
                </span>
                <span className="text-accent-success">Valid</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Expires
                </span>
                <span className="text-text-primary">{formatDate(carrier.insuranceExpiry)}</span>
              </div>
            </div>
          </div>

          {/* DOT Info */}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h4 className="font-semibold text-text-primary mb-4">Authority</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">MC Number</span>
                <span className="text-text-primary font-mono">{carrier.mcNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">DOT Number</span>
                <span className="text-text-primary font-mono">{carrier.dotNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
