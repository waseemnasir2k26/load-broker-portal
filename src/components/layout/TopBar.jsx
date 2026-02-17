import { useState } from 'react'
import { Bell, Search, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const { user, currentRole, roles, switchRole, logout } = useAuth()
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  const roleLabels = {
    customer: 'Customer (Shipper)',
    carrier: 'Carrier (Driver)',
    dispatch: 'Dispatch',
    admin: 'Admin'
  }

  const roleColors = {
    customer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    carrier: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    dispatch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    admin: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search shipments, carriers..."
            className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-accent-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`
              flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium
              ${roleColors[currentRole]}
              hover:opacity-80 transition-opacity
            `}
          >
            <span>Demo: {roleLabels[currentRole]}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {showRoleMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRoleMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border rounded-xl shadow-xl z-50 py-2">
                <p className="px-4 py-2 text-xs text-text-muted uppercase tracking-wider">Switch Role</p>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role)
                      setShowRoleMenu(false)
                    }}
                    className={`
                      w-full px-4 py-2 text-left text-sm hover:bg-bg-hover transition-colors
                      ${currentRole === role ? 'text-accent-primary' : 'text-text-primary'}
                    `}
                  >
                    {roleLabels[role]}
                    {currentRole === role && ' ✓'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-danger rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 hover:bg-bg-hover rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-secondary">{user?.company}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-secondary hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border rounded-xl shadow-xl z-50 py-2">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowUserMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-hover transition-colors flex items-center"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-accent-danger hover:bg-bg-hover transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
