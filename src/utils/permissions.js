const rolePermissions = {
  customer: {
    canViewDashboard: true,
    canViewOwnStats: true,
    canViewAllStats: false,
    canPostLoads: true,
    canBidOnLoads: false,
    canAcceptBids: false,
    canTrackOwnShipments: true,
    canTrackAllShipments: false,
    canViewCarrierScores: true,
    canEditCarrierScores: false,
    canMessageDispatch: true,
    canMessageAll: false,
    canViewOwnHistory: true,
    canViewAllHistory: false,
    canGenerateContracts: false,
    canManageUsers: false
  },
  carrier: {
    canViewDashboard: true,
    canViewOwnStats: true,
    canViewAllStats: false,
    canPostLoads: false,
    canBidOnLoads: true,
    canAcceptBids: false,
    canTrackOwnShipments: true,
    canTrackAllShipments: false,
    canViewCarrierScores: true,
    canEditCarrierScores: false,
    canMessageDispatch: true,
    canMessageAll: false,
    canViewOwnHistory: true,
    canViewAllHistory: false,
    canGenerateContracts: false,
    canManageUsers: false
  },
  dispatch: {
    canViewDashboard: true,
    canViewOwnStats: true,
    canViewAllStats: true,
    canPostLoads: true,
    canBidOnLoads: false,
    canAcceptBids: true,
    canTrackOwnShipments: true,
    canTrackAllShipments: true,
    canViewCarrierScores: true,
    canEditCarrierScores: true,
    canMessageDispatch: true,
    canMessageAll: true,
    canViewOwnHistory: true,
    canViewAllHistory: true,
    canGenerateContracts: true,
    canManageUsers: false
  },
  admin: {
    canViewDashboard: true,
    canViewOwnStats: true,
    canViewAllStats: true,
    canPostLoads: true,
    canBidOnLoads: true,
    canAcceptBids: true,
    canTrackOwnShipments: true,
    canTrackAllShipments: true,
    canViewCarrierScores: true,
    canEditCarrierScores: true,
    canMessageDispatch: true,
    canMessageAll: true,
    canViewOwnHistory: true,
    canViewAllHistory: true,
    canGenerateContracts: true,
    canManageUsers: true
  }
}

export function hasPermission(role, permission) {
  return rolePermissions[role]?.[permission] || false
}

export function canAccessRoute(role, route) {
  const routePermissions = {
    '/dashboard': 'canViewDashboard',
    '/loads': 'canViewDashboard',
    '/history': 'canViewOwnHistory',
    '/tracking': 'canTrackOwnShipments',
    '/carriers': 'canViewCarrierScores',
    '/messages': 'canMessageDispatch',
    '/contracts': 'canGenerateContracts',
    '/settings': 'canViewDashboard'
  }
  const permission = routePermissions[route]
  return permission ? hasPermission(role, permission) : true
}

export function getFilteredNavItems(role) {
  const allItems = [
    { path: '/dashboard', label: 'Dashboard', permission: 'canViewDashboard' },
    { path: '/loads', label: 'Load Board', permission: 'canViewDashboard' },
    { path: '/history', label: 'Shipment History', permission: 'canViewOwnHistory' },
    { path: '/tracking', label: 'Tracking', permission: 'canTrackOwnShipments' },
    { path: '/carriers', label: 'Carrier Scores', permission: 'canViewCarrierScores' },
    { path: '/messages', label: 'Messages', permission: 'canMessageDispatch' },
    { path: '/contracts', label: 'Contracts', permission: 'canGenerateContracts' },
    { path: '/settings', label: 'Settings', permission: 'canViewDashboard' }
  ]
  return allItems.filter(item => hasPermission(role, item.permission))
}
