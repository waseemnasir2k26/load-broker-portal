# FreightCommand - Load Broker Portal

A premium React-based load broker web platform featuring a dark command center aesthetic. Built for freight logistics companies to manage shipments, carriers, and bidding operations.

## Features

- **Dashboard** - Role-adaptive overview with live stats, activity feed, and mini-map
- **Load Board** - Core feature for posting, bidding, and managing freight loads
- **Real-time Tracking** - Live GPS tracking with Leaflet maps
- **Carrier Scores** - Performance tracking with historical trends
- **Messaging** - In-app messaging tied to shipments
- **Contract Generator** - Automated freight contract generation
- **Multi-Role Support** - Customer, Carrier, Dispatch, and Admin views

## Tech Stack

- **React 18+** with Vite
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Leaflet** for maps (free, no API key needed)
- **Recharts** for analytics
- **Lucide React** for icons

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Demo Mode

This is a frontend demo with mock data. To sign in:

1. Enter any email and password on the login page
2. Use the **Role Switcher** in the top-right to switch between:
   - **Customer (Shipper)** - Post loads, track shipments
   - **Carrier (Driver)** - Bid on loads, view score
   - **Dispatch** - Manage all operations
   - **Admin** - Full access

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Auto-deploy on push

The `vercel.json` is pre-configured for SPA routing.

## License

Demo project for client presentation.
