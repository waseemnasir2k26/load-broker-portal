import { useApp } from '../context/AppContext'
import DashboardStats from '../components/dashboard/DashboardStats'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import MiniMap from '../components/dashboard/MiniMap'
import QuickActions from '../components/dashboard/QuickActions'
import DriverDashboard from '../components/dashboard/DriverDashboard'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/formatters'

export default function DashboardPage() {
  const { user, currentRole, isIlya, isDriver } = useAuth()
  const { loads } = useApp()

  // Calculate stats for Ilya's welcome message
  const activeShipments = loads.filter(l => ['assigned', 'picked_up', 'in_transit'].includes(l.status?.replace('-', '_'))).length
  const pendingBids = loads.filter(l => l.status === 'bidding').length
  const driversOnRoad = loads.filter(l => l.status?.replace('-', '_') === 'in_transit').length

  const roleGreetings = {
    superadmin: 'Owner',
    admin: 'Administrator',
    dispatch: 'Dispatcher',
    customer: 'Shipper',
    carrier: 'Carrier',
    driver: 'Driver'
  }

  // Driver gets specialized dashboard
  if (isDriver) {
    return <DriverDashboard />
  }

  return (
    <div className="space-y-6">
      {/* Header - Special for Ilya */}
      {isIlya ? (
        <div className="bg-gradient-to-r from-[#FA9B00]/10 to-transparent border border-[#FA9B00]/20 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Welcome back, Ilya <span className="inline-block animate-pulse">&#128075;</span>
          </h1>
          <p className="text-[#FA9B00] font-medium mt-1">
            A7 Transport Portal — {formatDate(new Date().toISOString())}
          </p>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">{activeShipments}</span> Active Shipments
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">{pendingBids}</span> Pending Bids
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FA9B00] rounded-full animate-pulse"></span>
              <span className="text-text-secondary">
                <span className="text-text-primary font-semibold">{driversOnRoad}</span> Drivers On Road
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-heading">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-text-secondary mt-1">
            Here's your {roleGreetings[currentRole]} dashboard overview
          </p>
        </div>
      )}

      {/* Stats */}
      <DashboardStats />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MiniMap />
          <ActivityFeed />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
