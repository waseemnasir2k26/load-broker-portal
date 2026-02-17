import { useState } from 'react'
import { User, Bell, Building, Shield, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user, currentRole } = useAuth()
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    company: user?.company || ''
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    loadUpdates: true,
    bidNotifications: true,
    deliveryAlerts: true
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-text-primary font-heading">Settings</h1>

      {/* Profile */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-primary/20 rounded-lg">
            <User className="w-5 h-5 text-accent-primary" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-warning/20 rounded-lg">
            <Bell className="w-5 h-5 text-accent-warning" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          {Object.entries({
            emailAlerts: 'Email Alerts',
            loadUpdates: 'Load Status Updates',
            bidNotifications: 'Bid Notifications',
            deliveryAlerts: 'Delivery Alerts'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-text-primary">{label}</span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${notifications[key] ? 'bg-accent-primary' : 'bg-bg-tertiary'}
                `}
              >
                <span
                  className={`
                    absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                    ${notifications[key] ? 'left-7' : 'left-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Role Info */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-purple/20 rounded-lg">
            <Shield className="w-5 h-5 text-accent-purple" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Account Role</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
          <div>
            <p className="text-text-primary font-medium capitalize">{currentRole}</p>
            <p className="text-sm text-text-secondary">Current active role</p>
          </div>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${currentRole === 'admin' ? 'bg-emerald-500/20 text-emerald-400' :
              currentRole === 'dispatch' ? 'bg-amber-500/20 text-amber-400' :
              currentRole === 'carrier' ? 'bg-purple-500/20 text-purple-400' :
              'bg-blue-500/20 text-blue-400'
            }
          `}>
            {currentRole}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2.5 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-primary/90 transition-colors btn-primary"
        >
          {saved ? (
            <>
              <span className="mr-2">Saved!</span>
              <span className="text-accent-success">✓</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
