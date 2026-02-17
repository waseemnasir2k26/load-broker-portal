import { createContext, useContext, useReducer } from 'react'
import loadsData from '../data/loads.json'
import carriersData from '../data/carriers.json'
import bidsData from '../data/bids.json'
import messagesData from '../data/messages.json'
import driversData from '../data/drivers.json'
import logger from '../utils/logger'

const AppContext = createContext(null)

// Add read status to messages
const messagesWithReadStatus = messagesData.map(msg => ({
  ...msg,
  read: Math.random() > 0.3, // Some unread for demo
  readAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null
}))

const initialState = {
  loads: loadsData,
  carriers: carriersData,
  bids: bidsData,
  messages: messagesWithReadStatus,
  drivers: driversData,
  notifications: [],
  activityLog: [], // GAP 9: Per-shipment activity log
  isLoading: false
}

function appReducer(state, action) {
  logger.state(`Dispatch: ${action.type}`, { payload: action.payload })

  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'ADD_LOAD':
      return { ...state, loads: [action.payload, ...state.loads] }

    case 'UPDATE_LOAD':
      return {
        ...state,
        loads: state.loads.map(load =>
          load.id === action.payload.id ? { ...load, ...action.payload } : load
        )
      }

    case 'ADD_BID':
      return { ...state, bids: [action.payload, ...state.bids] }

    case 'UPDATE_BID':
      return {
        ...state,
        bids: state.bids.map(bid =>
          bid.id === action.payload.id ? { ...bid, ...action.payload } : bid
        )
      }

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }

    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        messages: state.messages.map(msg =>
          action.payload.includes(msg.id)
            ? { ...msg, read: true, readAt: new Date().toISOString() }
            : msg
        )
      }

    case 'UPDATE_CARRIER':
      return {
        ...state,
        carriers: state.carriers.map(carrier =>
          carrier.id === action.payload.id ? { ...carrier, ...action.payload } : carrier
        )
      }

    case 'UPDATE_DRIVER':
      return {
        ...state,
        drivers: state.drivers.map(driver =>
          driver.id === action.payload.id ? { ...driver, ...action.payload } : driver
        )
      }

    case 'ASSIGN_DRIVER':
      return {
        ...state,
        loads: state.loads.map(load =>
          load.id === action.payload.loadId
            ? { ...load, assignedDriverId: action.payload.driverId, driverAssignedAt: new Date().toISOString() }
            : load
        ),
        drivers: state.drivers.map(driver =>
          driver.id === action.payload.driverId
            ? { ...driver, status: 'active', currentLoadId: action.payload.loadId }
            : driver
        )
      }

    case 'ADD_ACTIVITY':
      return {
        ...state,
        activityLog: [...state.activityLog, action.payload]
      }

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }

    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }

    default:
      logger.warn(logger.CATEGORIES.STATE, `Unknown action type: ${action.type}`)
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // GAP 9: Add activity to shipment log
  const addActivity = (loadId, activity) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      loadId,
      timestamp: new Date().toISOString(),
      ...activity
    }
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity })
    return newActivity
  }

  const addLoad = (load) => {
    const newLoad = {
      ...load,
      id: `SH-${Date.now()}`,
      postedDate: new Date().toISOString(),
      status: 'posted',
      bidsCount: 0,
      contractGenerated: false
    }
    logger.info(logger.CATEGORIES.STATE, 'Load created', { loadId: newLoad.id, origin: load.origin, destination: load.destination })
    dispatch({ type: 'ADD_LOAD', payload: newLoad })
    addActivity(newLoad.id, { type: 'load_posted', icon: '📋', description: 'Load posted', actor: load.postedBy || 'Shipper' })
    return newLoad
  }

  const updateLoad = (id, updates) => {
    logger.info(logger.CATEGORIES.STATE, 'Load updated', { loadId: id, updates: Object.keys(updates) })
    dispatch({ type: 'UPDATE_LOAD', payload: { id, ...updates } })
  }

  // GAP 4: Update shipment status with new statuses
  const updateShipmentStatus = (loadId, newStatus, actor = 'System') => {
    const statusLabels = {
      posted: 'Posted',
      bidding: 'Bidding Started',
      assigned: 'Assigned to Carrier',
      picked_up: 'Picked Up at Origin',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      closed: 'Closed'
    }

    const statusIcons = {
      posted: '📋',
      bidding: '🔄',
      assigned: '✅',
      picked_up: '📦',
      in_transit: '🚛',
      delivered: '🏁',
      closed: '🔒'
    }

    updateLoad(loadId, { status: newStatus, [`${newStatus}At`]: new Date().toISOString() })
    addActivity(loadId, {
      type: 'status_change',
      icon: statusIcons[newStatus] || '📌',
      description: statusLabels[newStatus] || `Status: ${newStatus}`,
      actor
    })
  }

  const addBid = (bid) => {
    const newBid = {
      ...bid,
      id: `BID-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    logger.info(logger.CATEGORIES.STATE, 'Bid submitted', { bidId: newBid.id, loadId: bid.loadId, amount: bid.amount })
    dispatch({ type: 'ADD_BID', payload: newBid })

    const load = state.loads.find(l => l.id === bid.loadId)
    if (load) {
      updateLoad(bid.loadId, { bidsCount: (load.bidsCount || 0) + 1, status: 'bidding' })
    }

    addActivity(bid.loadId, {
      type: 'bid_received',
      icon: '💰',
      description: `Bid received: $${bid.amount.toLocaleString()}`,
      actor: bid.carrierName || 'Carrier'
    })

    return newBid
  }

  const acceptBid = (bidId, loadId) => {
    const bid = state.bids.find(b => b.id === bidId)
    if (bid) {
      logger.info(logger.CATEGORIES.STATE, 'Bid accepted', { bidId, loadId, carrierId: bid.carrierId, amount: bid.amount })
      dispatch({ type: 'UPDATE_BID', payload: { id: bidId, status: 'accepted' } })
      updateLoad(loadId, {
        status: 'assigned',
        assignedCarrierId: bid.carrierId,
        acceptedBidId: bidId,
        rate: bid.amount,
        assignedAt: new Date().toISOString()
      })

      // Reject other bids
      state.bids.filter(b => b.loadId === loadId && b.id !== bidId).forEach(b => {
        dispatch({ type: 'UPDATE_BID', payload: { id: b.id, status: 'rejected' } })
      })

      addActivity(loadId, {
        type: 'bid_accepted',
        icon: '✅',
        description: `Bid accepted: $${bid.amount.toLocaleString()}`,
        actor: 'Dispatch'
      })
    } else {
      logger.error(logger.CATEGORIES.STATE, 'Bid not found for acceptance', { bidId, loadId })
    }
  }

  // GAP 6: Assign driver to load
  const assignDriver = (loadId, driverId, carrierName) => {
    const driver = state.drivers.find(d => d.id === driverId)
    if (driver) {
      dispatch({ type: 'ASSIGN_DRIVER', payload: { loadId, driverId } })
      addActivity(loadId, {
        type: 'driver_assigned',
        icon: '🚚',
        description: `Driver assigned: ${driver.name} - ${driver.truckNumber}`,
        actor: carrierName || 'Carrier'
      })
      logger.info(logger.CATEGORIES.STATE, 'Driver assigned', { loadId, driverId, driverName: driver.name })
    }
  }

  // GAP 7: Mark contract as generated
  const markContractGenerated = (loadId, generatedBy) => {
    updateLoad(loadId, { contractGenerated: true, contractGeneratedAt: new Date().toISOString() })
    addActivity(loadId, {
      type: 'contract_generated',
      icon: '📄',
      description: 'Contract generated',
      actor: generatedBy || 'Dispatch'
    })
  }

  // GAP 9: Add carrier score
  const scoreCarrier = (loadId, carrierId, score, notes, scoredBy) => {
    const carrier = state.carriers.find(c => c.id === carrierId)
    if (carrier) {
      const newScore = Math.round((carrier.score * carrier.completedLoads + score) / (carrier.completedLoads + 1))
      dispatch({
        type: 'UPDATE_CARRIER',
        payload: {
          id: carrierId,
          score: newScore,
          completedLoads: carrier.completedLoads + 1
        }
      })
      addActivity(loadId, {
        type: 'carrier_scored',
        icon: '⭐',
        description: `Carrier scored: ${score}% - "${notes}"`,
        actor: scoredBy || 'Dispatch'
      })
    }
  }

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      readAt: null
    }
    logger.info(logger.CATEGORIES.STATE, 'Message sent', { messageId: newMessage.id, loadId: message.loadId })
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage })

    // Add to activity log if associated with a load
    if (message.loadId) {
      addActivity(message.loadId, {
        type: 'message_sent',
        icon: '💬',
        description: `Message: "${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}"`,
        actor: message.sender || 'User'
      })
    }

    return newMessage
  }

  // GAP 8: Mark messages as read
  const markMessagesRead = (messageIds) => {
    dispatch({ type: 'MARK_MESSAGES_READ', payload: messageIds })
  }

  // GAP 8: Get unread message count
  const getUnreadCount = () => {
    return state.messages.filter(msg => !msg.read).length
  }

  // Getters
  const getLoadById = (id) => state.loads.find(load => load.id === id)
  const getBidsForLoad = (loadId) => state.bids.filter(bid => bid.loadId === loadId)
  const getCarrierById = (id) => state.carriers.find(carrier => carrier.id === id)
  const getMessagesForLoad = (loadId) => state.messages.filter(msg => msg.loadId === loadId)
  const getDriverById = (id) => state.drivers.find(driver => driver.id === id)
  const getDriversForCarrier = (carrierId) => state.drivers.filter(d => d.carrierId === carrierId)
  const getActivitiesForLoad = (loadId) => state.activityLog.filter(a => a.loadId === loadId)
  const getAssignedLoadForDriver = (driverId) => {
    const driver = state.drivers.find(d => d.id === driverId)
    if (driver?.currentLoadId) {
      return state.loads.find(l => l.id === driver.currentLoadId)
    }
    return null
  }

  return (
    <AppContext.Provider value={{
      ...state,
      addLoad,
      updateLoad,
      updateShipmentStatus,
      addBid,
      acceptBid,
      assignDriver,
      markContractGenerated,
      scoreCarrier,
      addMessage,
      markMessagesRead,
      getUnreadCount,
      addActivity,
      getLoadById,
      getBidsForLoad,
      getCarrierById,
      getMessagesForLoad,
      getDriverById,
      getDriversForCarrier,
      getActivitiesForLoad,
      getAssignedLoadForDriver,
      dispatch
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
