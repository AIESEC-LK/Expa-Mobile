// App.jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ApplicationsOfOpportunitiesIManage from './pages/ApplicationsOfOpportunitiesIManage.jsx'
import HomePage from './pages/Home.jsx'
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

  return <>{authenticated ? children : null}</>
}

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} /> {/* Default/Home Page */}
            <Route path="/icx/applications/my-opportunities" element={<ApplicationsOfOpportunitiesIManage />} />
            <Route path="/ogx" element={<OGXPage />} /> {/* OGX Page */}
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
