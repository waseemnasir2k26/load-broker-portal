import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/common/ErrorBoundary'
import DebugPanel from './components/debug/DebugPanel'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LoadBoardPage from './pages/LoadBoardPage'
import LoadDetailPage from './pages/LoadDetailPage'
import ShipmentHistoryPage from './pages/ShipmentHistoryPage'
import TrackingPage from './pages/TrackingPage'
import CarrierScoresPage from './pages/CarrierScoresPage'
import MessagesPage from './pages/MessagesPage'
import ContractsPage from './pages/ContractsPage'
import SettingsPage from './pages/SettingsPage'
import GuidePage from './pages/GuidePage'
import logger from './utils/logger'

function RouteLogger() {
  const location = useLocation()

  useEffect(() => {
    logger.route('Navigation', {
      path: location.pathname,
      search: location.search,
      hash: location.hash
    })
  }, [location])

  return null
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PageWrapper({ children, name }) {
  return (
    <ErrorBoundary name={name}>
      {children}
    </ErrorBoundary>
  )
}

function App() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    logger.info(logger.CATEGORIES.SYSTEM, 'App mounted', {
      isAuthenticated,
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }, [])

  return (
    <ErrorBoundary name="AppRoot">
      <RouteLogger />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <PageWrapper name="LoginPage">
                <LoginPage />
              </PageWrapper>
            )
          }
        />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<PageWrapper name="DashboardPage"><DashboardPage /></PageWrapper>} />
          <Route path="loads" element={<PageWrapper name="LoadBoardPage"><LoadBoardPage /></PageWrapper>} />
          <Route path="loads/:id" element={<PageWrapper name="LoadDetailPage"><LoadDetailPage /></PageWrapper>} />
          <Route path="history" element={<PageWrapper name="ShipmentHistoryPage"><ShipmentHistoryPage /></PageWrapper>} />
          <Route path="tracking" element={<PageWrapper name="TrackingPage"><TrackingPage /></PageWrapper>} />
          <Route path="carriers" element={<PageWrapper name="CarrierScoresPage"><CarrierScoresPage /></PageWrapper>} />
          <Route path="messages" element={<PageWrapper name="MessagesPage"><MessagesPage /></PageWrapper>} />
          <Route path="contracts" element={<PageWrapper name="ContractsPage"><ContractsPage /></PageWrapper>} />
          <Route path="settings" element={<PageWrapper name="SettingsPage"><SettingsPage /></PageWrapper>} />
          <Route path="guide" element={<PageWrapper name="GuidePage"><GuidePage /></PageWrapper>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <DebugPanel />
    </ErrorBoundary>
  )
}

export default App
