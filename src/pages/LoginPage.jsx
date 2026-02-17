import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Mail, Lock, Eye, EyeOff, Users, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { demoAccounts } from '../data/demoAccounts'
import logger from '../utils/logger'

function DemoAccountCard({ account, onSelect, isSelected }) {
  const badgeClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }

  const iconBgClasses = {
    emerald: 'bg-emerald-500/10',
    amber: 'bg-amber-500/10',
    purple: 'bg-purple-500/10',
    blue: 'bg-blue-500/10'
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(account)}
      className={`w-full p-3 rounded-xl border text-left transition-all duration-200
        ${isSelected
          ? `${badgeClasses[account.badgeColor]} border-2`
          : 'bg-bg-tertiary border-border hover:border-text-muted'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClasses[account.badgeColor]}`}>
          <Users className={`w-5 h-5 ${badgeClasses[account.badgeColor].split(' ')[1]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">
              {account.name}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${badgeClasses[account.badgeColor]}`}>
              {account.badge}
            </span>
          </div>
          <p className="text-xs text-text-muted truncate">{account.description}</p>
        </div>
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-accent-primary rotate-90' : 'text-text-muted'}`} />
      </div>
    </button>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, switchRole } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [activeTab, setActiveTab] = useState('demo') // 'demo' or 'manual'

  const handleDemoLogin = (account) => {
    setSelectedAccount(account)
    setEmail(account.email)
    setPassword(account.password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    logger.auth('Login attempt', {
      email: email,
      isDemoAccount: !!selectedAccount,
      demoRole: selectedAccount?.role
    })

    setTimeout(() => {
      // Enable demo mode flag
      localStorage.setItem('lbp_demo_mode', 'true')

      // Login with email
      login(email, password)

      // If a demo account was selected, switch to that role
      if (selectedAccount) {
        switchRole(selectedAccount.role)
        logger.auth('Logged in as demo account', { role: selectedAccount.role })
      }

      logger.auth('Login successful', { email })
      navigate('/dashboard')
    }, 800)
  }

  const handleQuickStart = (account) => {
    setLoading(true)
    setSelectedAccount(account)

    logger.auth('Quick start login', { role: account.role })

    setTimeout(() => {
      localStorage.setItem('lbp_demo_mode', 'true')
      login(account.email, account.password)
      switchRole(account.role)
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 animate-fade-up">
        <div className="bg-bg-secondary border border-border rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-accent-primary/10 rounded-2xl mb-4">
              <Truck className="w-10 h-10 text-accent-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary font-heading">FreightCommand</h1>
            <p className="text-text-secondary mt-2">Load Broker Portal</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-1 p-1 bg-bg-tertiary rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'demo'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              Demo Accounts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'manual'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              Manual Login
            </button>
          </div>

          {activeTab === 'demo' ? (
            <>
              {/* Demo Account Selection */}
              <div className="space-y-2 mb-6">
                <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Click any account to login instantly
                </p>
                {demoAccounts.map((account) => (
                  <DemoAccountCard
                    key={account.id}
                    account={account}
                    isSelected={selectedAccount?.id === account.id}
                    onSelect={handleQuickStart}
                  />
                ))}
              </div>

              {/* Loading State for Quick Start */}
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <svg className="animate-spin h-6 w-6 text-accent-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2 text-text-secondary">Signing in...</span>
                </div>
              )}
            </>
          ) : (
            /* Manual Login Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-accent-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-accent-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-primary/90 disabled:opacity-50 transition-all btn-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Demo Notice */}
              <div className="p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-xl">
                <p className="text-sm text-text-secondary text-center">
                  <span className="text-accent-primary font-semibold">Demo Mode:</span> Enter any email and password to sign in.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">
          FreightCommand Load Broker Portal
        </p>
      </div>
    </div>
  )
}
