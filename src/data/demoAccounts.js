/**
 * Demo Account Configurations for Load Broker Portal
 * Each account demonstrates different role capabilities and views
 */

export const demoAccounts = [
  {
    id: 'demo-admin',
    email: 'admin@loadbroker.demo',
    password: 'demo123',
    name: 'Sarah Mitchell',
    company: 'LoadBroker HQ',
    role: 'admin',
    avatar: null,
    description: 'Full platform access with admin controls',
    features: [
      'View all loads and shipments',
      'Manage carriers and users',
      'Access analytics dashboard',
      'Configure system settings',
      'Approve/reject bids'
    ],
    badge: 'Super Admin',
    badgeColor: 'emerald'
  },
  {
    id: 'demo-dispatch',
    email: 'dispatch@loadbroker.demo',
    password: 'demo123',
    name: 'Mike Chen',
    company: 'LoadBroker Operations',
    role: 'dispatch',
    avatar: null,
    description: 'Operations management and load coordination',
    features: [
      'Post and manage loads',
      'Coordinate with carriers',
      'Track active shipments',
      'Handle dispatch messaging',
      'View carrier scores'
    ],
    badge: 'Dispatch',
    badgeColor: 'amber'
  },
  {
    id: 'demo-carrier',
    email: 'carrier@loadbroker.demo',
    password: 'demo123',
    name: 'James Rodriguez',
    company: 'Swift Transport LLC',
    role: 'carrier',
    avatar: null,
    description: 'Carrier portal for bidding and shipments',
    features: [
      'Browse available loads',
      'Submit competitive bids',
      'Manage active shipments',
      'Update delivery status',
      'View performance scores'
    ],
    badge: 'Carrier',
    badgeColor: 'purple'
  },
  {
    id: 'demo-customer',
    email: 'customer@loadbroker.demo',
    password: 'demo123',
    name: 'Emily Watson',
    company: 'TechCorp Industries',
    role: 'customer',
    avatar: null,
    description: 'Shipper view for tracking and history',
    features: [
      'Request new shipments',
      'Track active loads',
      'View shipment history',
      'Access delivery documents',
      'Rate carrier service'
    ],
    badge: 'Shipper',
    badgeColor: 'blue'
  }
]

export const demoCredentials = {
  notice: 'This is a demo environment with simulated data.',
  resetInfo: 'Data resets on page refresh.',
  supportEmail: 'support@loadbroker.demo'
}

export const getRoleDescription = (role) => {
  const descriptions = {
    admin: 'Full platform administration with access to all features, user management, and system configuration.',
    dispatch: 'Operations team member responsible for coordinating loads, managing carriers, and ensuring timely deliveries.',
    carrier: 'Transportation provider who can browse loads, submit bids, and manage their active shipments.',
    customer: 'Shipper who needs to move freight, track shipments, and manage their shipping history.'
  }
  return descriptions[role] || ''
}

export const getRolePermissions = (role) => {
  const permissions = {
    admin: [
      'view_all_loads',
      'post_loads',
      'edit_loads',
      'delete_loads',
      'view_bids',
      'accept_bids',
      'reject_bids',
      'view_carriers',
      'manage_carriers',
      'view_analytics',
      'manage_users',
      'system_settings',
      'view_contracts',
      'create_contracts',
      'messaging'
    ],
    dispatch: [
      'view_all_loads',
      'post_loads',
      'edit_loads',
      'view_bids',
      'accept_bids',
      'reject_bids',
      'view_carriers',
      'view_analytics',
      'messaging'
    ],
    carrier: [
      'view_available_loads',
      'place_bids',
      'view_own_bids',
      'view_own_shipments',
      'update_shipment_status',
      'view_own_scores',
      'messaging'
    ],
    customer: [
      'view_own_loads',
      'request_loads',
      'view_own_shipments',
      'view_tracking',
      'view_history',
      'messaging'
    ]
  }
  return permissions[role] || []
}

export default demoAccounts
