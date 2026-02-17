import { Package, Truck, Clock, CheckCircle, Star } from 'lucide-react'
import StatCard from '../common/StatCard'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export default function DashboardStats() {
  const { loads } = useApp()
  const { currentRole, hasPermission } = useAuth()

  const stats = {
    activeShipments: loads.filter(l => ['posted', 'bidding', 'assigned', 'in-transit'].includes(l.status)).length,
    inTransit: loads.filter(l => l.status === 'in-transit').length,
    pendingBids: loads.filter(l => l.status === 'bidding').length,
    deliveredThisMonth: loads.filter(l => l.status === 'delivered').length,
    averageScore: 96
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <StatCard
        title="Active Shipments"
        value={stats.activeShipments}
        icon={Package}
        trend="up"
        trendValue="12% from last week"
        delay={0}
      />
      <StatCard
        title="In Transit"
        value={stats.inTransit}
        icon={Truck}
        delay={100}
      />
      <StatCard
        title="Pending Bids"
        value={stats.pendingBids}
        icon={Clock}
        delay={200}
      />
      <StatCard
        title="Delivered This Month"
        value={stats.deliveredThisMonth}
        icon={CheckCircle}
        trend="up"
        trendValue="8% from last month"
        delay={300}
      />
      {(currentRole === 'dispatch' || currentRole === 'admin') && (
        <StatCard
          title="Avg Carrier Score"
          value={stats.averageScore}
          format="percent"
          icon={Star}
          delay={400}
        />
      )}
    </div>
  )
}
