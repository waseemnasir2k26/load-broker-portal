import { createContext, useContext, useReducer } from 'react'
import loadsData from '../data/loads.json'
import carriersData from '../data/carriers.json'
import bidsData from '../data/bids.json'
import messagesData from '../data/messages.json'
import logger from '../utils/logger'

const AppContext = createContext(null)

const initialState = {
  loads: loadsData,
  carriers: carriersData,
  bids: bidsData,
  messages: messagesData,
  notifications: [],
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
    case 'UPDATE_CARRIER':
      return {
        ...state,
        carriers: state.carriers.map(carrier =>
          carrier.id === action.payload.id ? { ...carrier, ...action.payload } : carrier
        )
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

  const addLoad = (load) => {
    const newLoad = {
      ...load,
      id: `SH-${Date.now()}`,
      postedDate: new Date().toISOString(),
      status: 'posted',
      bidsCount: 0
    }
    logger.info(logger.CATEGORIES.STATE, 'Load created', { loadId: newLoad.id, origin: load.origin, destination: load.destination })
    dispatch({ type: 'ADD_LOAD', payload: newLoad })
    return newLoad
  }

  const updateLoad = (id, updates) => {
    logger.info(logger.CATEGORIES.STATE, 'Load updated', { loadId: id, updates: Object.keys(updates) })
    dispatch({ type: 'UPDATE_LOAD', payload: { id, ...updates } })
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
    return newBid
  }

  const acceptBid = (bidId, loadId) => {
    const bid = state.bids.find(b => b.id === bidId)
    if (bid) {
      logger.info(logger.CATEGORIES.STATE, 'Bid accepted', { bidId, loadId, carrierId: bid.carrierId, amount: bid.amount })
      dispatch({ type: 'UPDATE_BID', payload: { id: bidId, status: 'accepted' } })
      updateLoad(loadId, { status: 'assigned', assignedCarrierId: bid.carrierId, acceptedBidId: bidId, rate: bid.amount })
      state.bids.filter(b => b.loadId === loadId && b.id !== bidId).forEach(b => {
        dispatch({ type: 'UPDATE_BID', payload: { id: b.id, status: 'rejected' } })
      })
    } else {
      logger.error(logger.CATEGORIES.STATE, 'Bid not found for acceptance', { bidId, loadId })
    }
  }

  const addMessage = (message) => {
    const newMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    logger.info(logger.CATEGORIES.STATE, 'Message sent', { messageId: newMessage.id, loadId: message.loadId })
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage })
    return newMessage
  }

  const getLoadById = (id) => state.loads.find(load => load.id === id)
  const getBidsForLoad = (loadId) => state.bids.filter(bid => bid.loadId === loadId)
  const getCarrierById = (id) => state.carriers.find(carrier => carrier.id === id)
  const getMessagesForLoad = (loadId) => state.messages.filter(msg => msg.loadId === loadId)

  return (
    <AppContext.Provider value={{
      ...state,
      addLoad,
      updateLoad,
      addBid,
      acceptBid,
      addMessage,
      getLoadById,
      getBidsForLoad,
      getCarrierById,
      getMessagesForLoad,
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
