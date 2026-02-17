import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  MapPin,
  MessageSquare,
  Settings
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/loads', label: 'Loads', icon: Package },
  { path: '/tracking', label: 'Track', icon: MapPin },
  { path: '/messages', label: 'Messages', icon: MessageSquare },
  { path: '/settings', label: 'Settings', icon: Settings }
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center px-3 py-2 rounded-lg
              ${isActive ? 'text-accent-primary' : 'text-text-secondary'}
            `}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
