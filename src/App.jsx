// App.jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import ApplicationsOfOpportunitiesIManage from './pages/ApplicationsOfOpportunitiesIManage.jsx'
import HomePage from './pages/Home.jsx'
import LandingPage from './pages/LandingPage.jsx'
import { Layout } from './pages/Layout.jsx'
import OGXPage from './pages/OGXPage.jsx'
import { useAuth } from './AuthProvider'

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth()

  if (loading) {
    return (
        <div className="flex justify-center items-center mt-10" style={{ height: 'calc(100vh - 350px)' }}>
          <div className="spinner"></div>
        </div>
    )
  }

  return <>{authenticated ? children : <Navigate to="/" replace />}</>
}

const AuthenticatedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth()
    //console.log("is_Authenticated => " + authenticated, "is_Loading" + loading)

  if (loading) {
    return (
        <div className="flex justify-center items-center mt-10" style={{ height: 'calc(100vh - 350px)' }}>
          <div className="spinner"></div>
        </div>
    )
  }

  return <>{authenticated ? children : <LandingPage />}</>
}

const App = () => {
  return (
      <div className="App">
        <Router>
          <Routes>
            {/* Landing Page - redirect to /app if authenticated */}
            <Route path="/" element={<AuthenticatedRoute><Navigate to="/app" replace /></AuthenticatedRoute>} />

            {/* Protected Routes */}
            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/app" element={<HomePage />} /> {/* Dashboard */}
              <Route path="/app/icx/applications/my-opportunities" element={<ApplicationsOfOpportunitiesIManage />} />
              <Route path="/app/ogx" element={<OGXPage />} />
            </Route>
          </Routes>
        </Router>
      </div>
  )
}

export default App
