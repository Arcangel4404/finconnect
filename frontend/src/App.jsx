import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { DashboardLayout } from './components/layout/dashboard-layout'
import { PageTransition } from './components/layout/page-transition'
import { DashboardPage } from './pages/dashboard-page'
import { IFSCLookupPage } from './pages/ifsc-lookup-page'
import { SchemesPage } from './pages/schemes-page'
import { PortfolioTrackerPage } from './pages/portfolio-tracker-page'
import { CalculatorsPage } from './pages/calculators-page'
import { FraudDetectionPage } from './pages/fraud-detection-page'
import { RecommendationsPage } from './pages/recommendations-page'
import { NewsDetailPage } from './pages/news-detail-page'

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <DashboardPage />
          </PageTransition>
        } />
        <Route path="/calculators" element={
          <PageTransition>
            <CalculatorsPage />
          </PageTransition>
        } />
        <Route path="/bank-lookup" element={
          <PageTransition>
            <IFSCLookupPage />
          </PageTransition>
        } />
        <Route path="/schemes" element={
          <PageTransition>
            <SchemesPage />
          </PageTransition>
        } />
        <Route path="/portfolio" element={
          <PageTransition>
            <PortfolioTrackerPage />
          </PageTransition>
        } />
        <Route path="/fraud-detection" element={
          <PageTransition>
            <FraudDetectionPage />
          </PageTransition>
        } />
        <Route path="/recommendations" element={
          <PageTransition>
            <RecommendationsPage />
          </PageTransition>
        } />
        <Route path="/news/:id" element={
          <PageTransition>
            <NewsDetailPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
    </BrowserRouter>
  )
}

// Error Boundary to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{this.state.error?.message || 'An error occurred'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrap with ErrorBoundary
function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}

export default AppWithErrorBoundary
