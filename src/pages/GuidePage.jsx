import { useState } from 'react'
import {
  BookOpen, Users, Truck, Package, MapPin, MessageSquare,
  FileText, Settings, BarChart3, Shield, ChevronRight,
  ChevronDown, PlayCircle, CheckCircle, Star, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { demoAccounts, getRoleDescription } from '../data/demoAccounts'

const guideCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: PlayCircle,
    color: 'orange',
    sections: [
      {
        title: 'Welcome to A7 Transport Portal',
        content: `A7 Transport Portal is a comprehensive freight brokerage platform designed for Ilya Prokhnevski's A7 Transport business.

This demo environment showcases all platform features with simulated data. Feel free to explore, click around, and test any functionality.

Key capabilities:
• Post and manage freight loads
• Real-time shipment tracking with GPS
• Carrier bidding and selection
• Driver assignment and status updates
• Performance analytics and scoring
• Secure messaging between parties
• Contract generation with A7 branding`
      },
      {
        title: 'Understanding User Roles',
        content: `The platform offers six distinct user roles, each with different permissions and views:

**Super Admin (Ilya)** - Full owner access including all features, analytics, and system settings.

**Admin** - Full platform access including user management, system settings, and analytics dashboards.

**Dispatch** - Operations role for posting loads, coordinating with carriers, and managing active shipments.

**Carrier** - Transportation provider view for browsing loads, submitting bids, assigning drivers, and tracking deliveries.

**Customer/Shipper** - Freight owner perspective for requesting shipments and tracking cargo.

**Driver** - Mobile-friendly view for assigned loads, status updates (Picked Up/Delivered), and GPS tracking.

Use the role switcher in the top navigation bar to instantly switch between perspectives.`
      },
      {
        title: 'Navigation Overview',
        content: `The sidebar menu provides quick access to all platform features:

• **Dashboard** - Overview metrics, recent activity, and quick actions
• **Load Board** - Browse, search, and manage freight loads
• **Tracking** - Real-time GPS tracking with interactive maps
• **History** - Complete shipment history with filters
• **Carriers** - Carrier directory with performance scores
• **Messages** - Secure communication hub
• **Contracts** - Generate and manage shipping contracts
• **Settings** - Profile and notification preferences`
      }
    ]
  },
  {
    id: 'loads',
    title: 'Managing Loads',
    icon: Package,
    color: 'green',
    sections: [
      {
        title: 'Posting a New Load',
        content: `To post a new load (Admin/Dispatch roles):

1. Navigate to **Load Board** from the sidebar
2. Click the **"Post Load"** button
3. Fill in the shipment details:
   - Origin and destination cities
   - Pickup and delivery dates
   - Cargo type and weight
   - Equipment requirements
   - Rate range
4. Click **Submit** to publish the load

Posted loads immediately appear on the board for carriers to view and bid on.`
      },
      {
        title: 'Bidding on Loads',
        content: `Carriers can submit bids on available loads:

1. Browse the **Load Board** for available shipments
2. Click on a load to view full details
3. Navigate to the **Bids** tab
4. Enter your bid amount and any notes
5. Submit your bid for review

Dispatchers will review bids and select the best carrier based on price, score, and availability.`
      },
      {
        title: 'Understanding Load Statuses',
        content: `Loads progress through several stages:

**Posted** - New load, accepting bids
**Bidding** - Active bids from carriers
**Assigned** - Carrier selected, awaiting pickup
**Picked Up** - Driver confirmed pickup (A7 orange)
**In Transit** - Load en route to destination
**Delivered** - Successfully delivered
**Closed** - Final stage, paperwork complete

Each status change is logged with timestamps for complete audit trails. Drivers can update status to "Picked Up" and "Delivered" from their mobile dashboard.`
      }
    ]
  },
  {
    id: 'tracking',
    title: 'Real-Time Tracking',
    icon: MapPin,
    color: 'purple',
    sections: [
      {
        title: 'Using the Tracking Map',
        content: `The tracking page provides real-time visibility into active shipments:

• **Interactive Map** - View all active shipments on a dark-themed map
• **Shipment Markers** - Color-coded pins show shipment status
• **Route Lines** - Visualize planned routes from origin to destination
• **Click to Select** - Click any marker to view shipment details

The map automatically updates to show the latest GPS positions.`
      },
      {
        title: 'Tracking Timeline',
        content: `Each shipment includes a detailed timeline showing:

• Pickup confirmation with timestamp
• Major checkpoint updates
• Border crossings or waypoints
• Estimated arrival updates
• Delivery confirmation

Carriers can update their position through the mobile app, and the timeline reflects each status change.`
      }
    ]
  },
  {
    id: 'carriers',
    title: 'Carrier Management',
    icon: Truck,
    color: 'amber',
    sections: [
      {
        title: 'Carrier Scores',
        content: `The platform maintains performance scores for all carriers:

**Score Components:**
• On-time delivery rate
• Load acceptance rate
• Communication responsiveness
• Damage/claims history
• Customer feedback

Scores range from 0-100, with 85+ considered excellent. Use scores to make informed carrier selections.`
      },
      {
        title: 'Viewing Carrier Profiles',
        content: `Click on any carrier in the directory to view their full profile:

• Company information and contact details
• Equipment types and fleet size
• Service lanes and specializations
• Historical performance trends
• Recent shipment history
• Compliance and insurance status`
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Communication',
    icon: MessageSquare,
    color: 'cyan',
    sections: [
      {
        title: 'Using the Message Center',
        content: `The built-in messaging system enables secure communication:

• Messages are organized by shipment
• All conversations are logged for records
• Attach documents or images as needed
• Real-time notifications for new messages
• Search across all conversation history

Use messages to coordinate pickup times, address issues, or share documentation.`
      }
    ]
  },
  {
    id: 'contracts',
    title: 'Contracts & Documents',
    icon: FileText,
    color: 'indigo',
    sections: [
      {
        title: 'Generating Contracts',
        content: `Create professional rate confirmations:

1. Navigate to **Contracts** in the sidebar
2. Select a shipment or enter details manually
3. Review the auto-generated contract
4. Customize terms if needed
5. Export as PDF for signatures

Contracts include all essential terms, carrier/shipper details, and rate information.`
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    icon: BarChart3,
    color: 'rose',
    sections: [
      {
        title: 'Dashboard Metrics',
        content: `The dashboard provides key performance indicators:

• **Active Loads** - Currently posted or in-transit
• **Revenue** - Total and average per load
• **On-Time Rate** - Delivery performance
• **Carrier Activity** - Bids and assignments

Charts show trends over time to identify patterns and opportunities for improvement.`
      }
    ]
  }
]

function Section({ section, isOpen, onToggle }) {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-tertiary/50 transition-colors"
      >
        <span className="text-text-primary font-medium">{section.title}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-text-muted" />
        ) : (
          <ChevronRight className="w-5 h-5 text-text-muted" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="prose prose-invert prose-sm max-w-none">
            {section.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Category({ category, expandedSections, toggleSection }) {
  const Icon = category.icon
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    indigo: 'bg-indigo-500/20 text-indigo-400',
    rose: 'bg-rose-500/20 text-rose-400',
    orange: 'bg-[#FA9B00]/20 text-[#FA9B00]'
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className={`p-2 rounded-lg ${colorClasses[category.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">{category.title}</h2>
      </div>
      <div>
        {category.sections.map((section, idx) => (
          <Section
            key={idx}
            section={section}
            isOpen={expandedSections.has(`${category.id}-${idx}`)}
            onToggle={() => toggleSection(`${category.id}-${idx}`)}
          />
        ))}
      </div>
    </div>
  )
}

function RoleCard({ account, isCurrentRole, onSelect }) {
  const colorClasses = {
    emerald: 'border-emerald-500/50 bg-emerald-500/10',
    amber: 'border-amber-500/50 bg-amber-500/10',
    purple: 'border-purple-500/50 bg-purple-500/10',
    blue: 'border-blue-500/50 bg-blue-500/10',
    orange: 'border-[#FA9B00]/50 bg-[#FA9B00]/10',
    cyan: 'border-cyan-500/50 bg-cyan-500/10'
  }

  const badgeClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-[#FA9B00]/20 text-[#FA9B00]',
    cyan: 'bg-cyan-500/20 text-cyan-400'
  }

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all cursor-pointer
        ${isCurrentRole
          ? colorClasses[account.badgeColor]
          : 'border-border bg-bg-secondary hover:border-text-muted'
        }`}
      onClick={onSelect}
    >
      {isCurrentRole && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badgeClasses[account.badgeColor]}`}>
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-text-primary font-medium">{account.name}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClasses[account.badgeColor]}`}>
            {account.badge}
          </span>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3">{account.description}</p>

      <ul className="space-y-1">
        {account.features.slice(0, 3).map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs text-text-muted">
            <Zap className="w-3 h-3 text-accent-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GuidePage() {
  const { currentRole, switchRole } = useAuth()
  const [expandedSections, setExpandedSections] = useState(new Set(['getting-started-0']))

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionKey)) {
        next.delete(sectionKey)
      } else {
        next.add(sectionKey)
      }
      return next
    })
  }

  const handleRoleSelect = (role) => {
    switchRole(role)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/20 rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-accent-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary font-heading mb-2">
          A7 Transport Guide
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Welcome to A7 Transport Portal. Explore this guide to understand all features
          and capabilities of your freight brokerage platform.
        </p>
      </div>

      {/* Quick Role Switcher */}
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Try Different Roles</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Click on a role to instantly switch your view and explore different perspectives.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoAccounts.map(account => (
            <RoleCard
              key={account.id}
              account={account}
              isCurrentRole={currentRole === account.role}
              onSelect={() => handleRoleSelect(account.role)}
            />
          ))}
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {guideCategories.map(category => (
          <Category
            key={category.id}
            category={category}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        ))}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-accent-primary/10 to-accent-purple/10 border border-accent-primary/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Pro Tips</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            Use keyboard shortcuts: Press <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-xs">/</kbd> to focus search
          </li>
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            Click column headers to sort load board data
          </li>
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            Double-click a load to quickly view full details
          </li>
          <li className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            Use filters to narrow down large result sets
          </li>
        </ul>
      </div>

      {/* Help Footer */}
      <div className="text-center text-sm text-text-muted py-4">
        <p>
          This is a demo environment. All data is simulated and resets on page refresh.
        </p>
        <p className="mt-1">
          Questions? Contact <a href="mailto:ilya@a7transport.com" className="text-accent-primary hover:underline">ilya@a7transport.com</a>
        </p>
      </div>
    </div>
  )
}
