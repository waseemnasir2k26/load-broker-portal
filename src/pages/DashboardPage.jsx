import DashboardStats from '../components/dashboard/DashboardStats'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import MiniMap from '../components/dashboard/MiniMap'
import QuickActions from '../components/dashboard/QuickActions'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, currentRole } = useAuth()

  const roleGreetings = {
    customer: 'Shipper',
    carrier: 'Carrier',
    dispatch: 'Dispatcher',
    admin: 'Administrator'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-heading">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-text-secondary mt-1">
          Here's your {roleGreetings[currentRole]} dashboard overview
        </p>
      </div>

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
