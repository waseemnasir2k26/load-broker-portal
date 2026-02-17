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
  BookOpen,
  Shield,
  Truck
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { A7LogoCompact } from '../common/A7Logo'

// Navigation items in specified order (GAP 12)
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/loads', label: 'Load Board', icon: Package },
  { path: '/tracking', label: 'Tracking', icon: MapPin },
  { path: '/messages', label: 'Messages', icon: MessageSquare, showBadge: true },
  { path: '/history', label: 'History', icon: History },
  { path: '/carriers', label: 'Carriers', icon: Users, roles: ['dispatch', 'admin', 'superadmin'] },
  { path: '/contracts', label: 'Contracts', icon: FileText, roles: ['dispatch', 'admin', 'superadmin'] },
  { path: '/admin', label: 'Admin Panel', icon: Shield, roles: ['superadmin'] },
  { path: '/guide', label: 'Guide', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings }
]

// Driver has limited navigation
const driverNavItems = [
  { path: '/dashboard', label: 'My Load', icon: Truck },
  { path: '/tracking', label: 'Route', icon: MapPin },
  { path: '/messages', label: 'Messages', icon: MessageSquare, showBadge: true },
  { path: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ collapsed, onToggle }) {
  const { currentRole } = useAuth()
  const { getUnreadCount } = useApp()
  const unreadCount = getUnreadCount ? getUnreadCount() : 0

  // Driver gets limited nav
  const items = currentRole === 'driver' ? driverNavItems : navItems

  const filteredItems = items.filter(item =>
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
      {/* Logo Header */}
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <A7LogoCompact collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative
                  ${isActive
                    ? 'bg-[#FA9B00]/10 text-[#FA9B00] border-l-2 border-[#FA9B00]'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && (
                  <span className="font-medium flex-1">{item.label}</span>
                )}
                {/* Unread badge for Messages */}
                {item.showBadge && unreadCount > 0 && (
                  <span className={`
                    notification-badge
                    ${collapsed ? 'absolute -top-1 -right-1' : ''}
                  `}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
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
