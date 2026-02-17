import { useNavigate } from 'react-router-dom'
import { Plus, Gavel, Package, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function QuickActions() {
  const navigate = useNavigate()
  const { currentRole } = useAuth()

  const actions = {
    customer: [
      { label: 'Post New Load', icon: Plus, path: '/loads?action=new', primary: true },
      { label: 'Track Shipments', icon: Package, path: '/tracking' },
      { label: 'View History', icon: Package, path: '/history' }
    ],
    carrier: [
      { label: 'Browse Open Loads', icon: Package, path: '/loads', primary: true },
      { label: 'My Active Loads', icon: Package, path: '/loads?status=assigned' },
      { label: 'View My Score', icon: Users, path: '/carriers' }
    ],
    dispatch: [
      { label: 'Post New Load', icon: Plus, path: '/loads?action=new', primary: true },
      { label: 'View Open Bids', icon: Gavel, path: '/loads?status=bidding' },
      { label: 'Manage Carriers', icon: Users, path: '/carriers' }
    ],
    admin: [
      { label: 'Post New Load', icon: Plus, path: '/loads?action=new', primary: true },
      { label: 'View All Loads', icon: Package, path: '/loads' },
      { label: 'Manage Carriers', icon: Users, path: '/carriers' }
    ]
  }

  const currentActions = actions[currentRole] || actions.dispatch

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-5 animate-fade-up">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {currentActions.map((action, index) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all
              ${action.primary
                ? 'bg-accent-primary text-white hover:bg-accent-primary/90 btn-primary'
                : 'bg-bg-tertiary text-text-primary hover:bg-bg-hover'
              }
            `}
          >
            <action.icon className="w-5 h-5 mr-3" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
