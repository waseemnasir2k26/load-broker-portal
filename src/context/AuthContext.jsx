import { createContext, useContext, useState, useEffect } from 'react'
import logger from '../utils/logger'
import { demoAccounts, getRolePermissions } from '../data/demoAccounts'

const AuthContext = createContext(null)

// 6 roles for A7 Transport (GAP 3, GAP 5)
const ROLES = ['superadmin', 'admin', 'dispatch', 'customer', 'carrier', 'driver']

// Default users per role
const defaultUsers = {
  superadmin: {
    id: 'usr_superadmin_001',
    name: 'Ilya Prokhnevski',
    email: 'ilya@a7transport.com',
    company: 'A7 Transport',
    title: 'Owner & Principal Broker',
    role: 'superadmin',
    phone: '(555) 100-0001',
    signature: 'Ilya Prokhnevski\nOwner, A7 Transport\nFMCSA Licensed Freight Broker'
  },
  admin: {
    id: 'usr_admin_001',
    name: 'Sarah Mitchell',
    email: 'admin@a7transport.com',
    company: 'A7 Transport',
    role: 'admin'
  },
  dispatch: {
    id: 'usr_dispatch_001',
    name: 'Mike Chen',
    email: 'dispatch@a7transport.com',
    company: 'A7 Transport',
    role: 'dispatch'
  },
  customer: {
    id: 'usr_customer_001',
    name: 'Emily Watson',
    email: 'shipper@techcorp.demo',
    company: 'TechCorp Industries',
    role: 'customer'
  },
  carrier: {
    id: 'usr_carrier_001',
    name: 'James Rodriguez',
    email: 'carrier@fasthaul.demo',
    company: 'FastHaul Logistics LLC',
    carrierId: 'carrier_001',
    role: 'carrier'
  },
  driver: {
    id: 'usr_driver_001',
    name: 'Carlos Mendez',
    email: 'driver@fasthaul.demo',
    company: 'FastHaul Logistics LLC',
    carrierId: 'carrier_001',
    driverId: 'driver_001',
    cdlNumber: 'CDL-TX-8847210',
    truckNumber: 'TRK-4471',
    role: 'driver'
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('currentRole') || 'dispatch'
  })
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('currentRole') || 'dispatch'
    return defaultUsers[savedRole] || defaultUsers.dispatch
  })

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated)
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('currentRole', currentRole)
    setUser(defaultUsers[currentRole] || defaultUsers.dispatch)
  }, [currentRole])

  const login = (email, password) => {
    logger.auth('User login', { email })
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    logger.auth('User logout', { userId: user?.id, email: user?.email })
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('lbp_demo_mode')
  }

  const switchRole = (role) => {
    if (ROLES.includes(role)) {
      logger.auth('Role switched', { from: currentRole, to: role })
      setCurrentRole(role)
    } else {
      logger.warn(logger.CATEGORIES.AUTH, 'Invalid role switch attempt', { attemptedRole: role })
    }
  }

  const hasPermission = (permission) => {
    const permissions = getRolePermissions(currentRole)
    const hasIt = permissions?.includes(permission) || false
    if (!hasIt && import.meta.env.DEV) {
      logger.debug(logger.CATEGORIES.AUTH, 'Permission check failed', { permission, role: currentRole })
    }
    return hasIt
  }

  // Check if user is Ilya (Super Admin) for personalized messages
  const isIlya = currentRole === 'superadmin'

  // Check if user can perform dispatch-level actions
  const canDispatch = ['superadmin', 'admin', 'dispatch'].includes(currentRole)

  // Check if user can view all data
  const canViewAll = ['superadmin', 'admin', 'dispatch'].includes(currentRole)

  // Check if user is a carrier (can assign drivers)
  const isCarrier = currentRole === 'carrier'

  // Check if user is a driver
  const isDriver = currentRole === 'driver'

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      currentRole,
      roles: ROLES,
      login,
      logout,
      switchRole,
      hasPermission,
      isIlya,
      canDispatch,
      canViewAll,
      isCarrier,
      isDriver
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
