/**
 * A7 Transport - Demo Account Configurations
 * Company: A7 Transport | Representative: Ilya Prokhnevski
 *
 * 6 Roles:
 * - Super Admin (Ilya Prokhnevski - Company Owner)
 * - Admin (System Administrator)
 * - Dispatch (Operations Worker)
 * - Shipper (Customer)
 * - Carrier (Fleet Company)
 * - Driver (Truck Driver)
 */

export const demoAccounts = [
  {
    id: 'demo-superadmin',
    email: 'ilya@a7transport.com',
    password: 'demo',
    name: 'Ilya Prokhnevski',
    company: 'A7 Transport',
    title: 'Owner & Principal Broker',
    role: 'superadmin',
    avatar: null,
    description: 'Company owner with full platform access',
    features: [
      'Full admin + dispatch + carrier access',
      'User and system management',
      'Generate contracts with signature',
      'View all analytics and reports',
      'Personalized dashboard welcome'
    ],
    badge: 'Owner',
    badgeColor: 'orange',
    icon: '👔',
    phone: '(555) 100-0001',
    signature: 'Ilya Prokhnevski\nOwner, A7 Transport\nFMCSA Licensed Freight Broker'
  },
  {
    id: 'demo-admin',
    email: 'admin@a7transport.com',
    password: 'demo',
    name: 'Sarah Mitchell',
    company: 'A7 Transport',
    role: 'admin',
    avatar: null,
    description: 'System administrator with full controls',
    features: [
      'Manage users and permissions',
      'Configure system settings',
      'View all loads and carriers',
      'Access analytics dashboard',
      'Approve/reject bids'
    ],
    badge: 'Admin',
    badgeColor: 'emerald',
    icon: '🛡️'
  },
  {
    id: 'demo-dispatch',
    email: 'dispatch@a7transport.com',
    password: 'demo',
    name: 'Mike Chen',
    company: 'A7 Transport',
    role: 'dispatch',
    avatar: null,
    description: 'Operations and load coordination',
    features: [
      'Post and manage loads',
      'Accept/reject carrier bids',
      'Track all shipments',
      'Score carrier performance',
      'Generate contracts'
    ],
    badge: 'Dispatch',
    badgeColor: 'amber',
    icon: '📋'
  },
  {
    id: 'demo-customer',
    email: 'shipper@techcorp.demo',
    password: 'demo',
    name: 'Emily Watson',
    company: 'TechCorp Industries',
    role: 'customer',
    avatar: null,
    description: 'Shipper posting loads and tracking',
    features: [
      'Post new shipment requests',
      'Track your active loads',
      'View shipment history',
      'Message dispatch team',
      'Access delivery documents'
    ],
    badge: 'Shipper',
    badgeColor: 'blue',
    icon: '📦'
  },
  {
    id: 'demo-carrier',
    email: 'carrier@fasthaul.demo',
    password: 'demo',
    name: 'James Rodriguez',
    company: 'FastHaul Logistics LLC',
    role: 'carrier',
    carrierId: 'carrier_001',
    avatar: null,
    description: 'Fleet company bidding on loads',
    features: [
      'Browse available loads',
      'Submit competitive bids',
      'Assign drivers to loads',
      'View carrier score',
      'Manage fleet shipments'
    ],
    badge: 'Carrier',
    badgeColor: 'purple',
    icon: '🚛'
  },
  {
    id: 'demo-driver',
    email: 'driver@fasthaul.demo',
    password: 'demo',
    name: 'Carlos Mendez',
    company: 'FastHaul Logistics LLC',
    role: 'driver',
    carrierId: 'carrier_001',
    driverId: 'driver_001',
    cdlNumber: 'CDL-TX-8847210',
    truckNumber: 'TRK-4471',
    avatar: null,
    description: 'Truck driver viewing assigned loads',
    features: [
      'View assigned load details',
      'Update pickup/delivery status',
      'Auto GPS location updates',
      'Message dispatch directly',
      'View route information'
    ],
    badge: 'Driver',
    badgeColor: 'indigo',
    icon: '🚚'
  }
]

export const demoCredentials = {
  notice: 'A7 Transport Demo Environment',
  resetInfo: 'Data resets on page refresh.',
  supportEmail: 'support@a7transport.com',
  company: 'A7 Transport',
  representative: 'Ilya Prokhnevski'
}

export const getRoleDescription = (role) => {
  const descriptions = {
    superadmin: 'Company owner with full platform access across Admin, Dispatcher, and Carrier roles. Personalized dashboard with welcome message.',
    admin: 'System administrator with access to all features, user management, and system configuration.',
    dispatch: 'Operations team member responsible for coordinating loads, managing carriers, scoring performance, and ensuring timely deliveries.',
    carrier: 'Fleet company that can browse loads, submit bids, accept loads, and assign drivers from their fleet.',
    customer: 'Shipper who posts loads, tracks shipments, and manages their shipping history.',
    driver: 'Truck driver assigned to loads by a carrier. Views assigned shipments, updates delivery status, and auto-shares GPS location.'
  }
  return descriptions[role] || ''
}

export const getRolePermissions = (role) => {
  const permissions = {
    superadmin: [
      'view_all_loads',
      'post_loads',
      'edit_loads',
      'delete_loads',
      'view_bids',
      'accept_bids',
      'reject_bids',
      'place_bids',
      'view_carriers',
      'manage_carriers',
      'score_carriers',
      'assign_driver',
      'view_analytics',
      'manage_users',
      'system_settings',
      'view_contracts',
      'create_contracts',
      'messaging',
      'view_all_tracking'
    ],
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
      'score_carriers',
      'view_analytics',
      'manage_users',
      'system_settings',
      'view_contracts',
      'create_contracts',
      'messaging',
      'view_all_tracking'
    ],
    dispatch: [
      'view_all_loads',
      'post_loads',
      'edit_loads',
      'view_bids',
      'accept_bids',
      'reject_bids',
      'view_carriers',
      'score_carriers',
      'view_analytics',
      'view_contracts',
      'create_contracts',
      'messaging',
      'view_all_tracking'
    ],
    carrier: [
      'view_available_loads',
      'place_bids',
      'view_own_bids',
      'accept_loads',
      'assign_driver',
      'view_own_shipments',
      'view_own_scores',
      'messaging',
      'view_own_tracking'
    ],
    customer: [
      'view_own_loads',
      'post_loads',
      'view_own_shipments',
      'view_tracking',
      'view_history',
      'messaging'
    ],
    driver: [
      'view_assigned_loads',
      'update_shipment_status',
      'update_location',
      'view_own_messages',
      'send_messages'
    ]
  }
  return permissions[role] || []
}

export const getRoleBadgeColor = (role) => {
  const colors = {
    superadmin: 'bg-[#FA9B00]/20 text-[#FA9B00] border-[#FA9B00]/30',
    admin: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dispatch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    carrier: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    customer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    driver: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  }
  return colors[role] || colors.customer
}

export default demoAccounts
