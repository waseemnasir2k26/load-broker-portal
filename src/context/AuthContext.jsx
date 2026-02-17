import { createContext, useContext, useState, useEffect } from 'react'
import logger from '../utils/logger'

const AuthContext = createContext(null)

const ROLES = ['customer', 'carrier', 'dispatch', 'admin']

const defaultUsers = {
  customer: { id: 'u1', name: 'John Smith', email: 'john@acmecorp.com', company: 'Acme Corporation', role: 'customer' },
  carrier: { id: 'u2', name: 'Mike Johnson', email: 'mike@fasthaulllc.com', company: 'FastHaul LLC', role: 'carrier' },
  dispatch: { id: 'u3', name: 'Sarah Williams', email: 'sarah@freightcommand.com', company: 'FreightCommand', role: 'dispatch' },
  admin: { id: 'u4', name: 'Admin User', email: 'admin@freightcommand.com', company: 'FreightCommand', role: 'admin' }
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
    return defaultUsers[savedRole]
  })

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated)
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('currentRole', currentRole)
    setUser(defaultUsers[currentRole])
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
    const permissions = {
      customer: ['viewOwnDashboard', 'postLoads', 'trackOwnShipments', 'viewCarrierScores', 'messageDispatch', 'viewOwnHistory'],
      carrier: ['viewOwnDashboard', 'bidOnLoads', 'trackOwnShipments', 'viewOwnScore', 'messageDispatch', 'viewOwnHistory'],
      dispatch: ['viewAllDashboard', 'postLoads', 'acceptBids', 'trackAllShipments', 'viewCarrierScores', 'editCarrierScores', 'messageAll', 'viewAllHistory', 'generateContracts'],
      admin: ['viewAllDashboard', 'postLoads', 'bidOnLoads', 'acceptBids', 'trackAllShipments', 'viewCarrierScores', 'editCarrierScores', 'messageAll', 'viewAllHistory', 'generateContracts', 'manageUsers']
    }
    const hasIt = permissions[currentRole]?.includes(permission) || false
    if (!hasIt && import.meta.env.DEV) {
      logger.debug(logger.CATEGORIES.AUTH, 'Permission check failed', { permission, role: currentRole })
    }
    return hasIt
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      currentRole,
      roles: ROLES,
      login,
      logout,
      switchRole,
      hasPermission
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
