import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  History,
  MapPin,
  Users,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  BookOpen
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/loads', label: 'Load Board', icon: Package },
  { path: '/history', label: 'Shipment History', icon: History },
  { path: '/tracking', label: 'Tracking', icon: MapPin },
  { path: '/carriers', label: 'Carrier Scores', icon: Users },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/contracts', label: 'Contracts', icon: FileText, roles: ['dispatch', 'admin'] },
  { path: '/guide', label: 'Guide', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ collapsed, onToggle }) {
  const { currentRole } = useAuth()

  const filteredItems = navItems.filter(item =>
    !item.roles || item.roles.includes(currentRole)
  )

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-bg-secondary border-r border-border
        transition-all duration-300 z-40 flex flex-col
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center">
          <div className="p-2 bg-accent-primary rounded-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-lg text-text-primary font-heading">
              FreightCommand
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <>
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span className="text-sm">Collapse</span>
          </>
        )}
      </button>
    </aside>
  )
}
