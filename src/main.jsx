import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './AuthProvider'
import initKeycloak from './keycloak'

const root = createRoot(document.getElementById('root'))

// Initialize Keycloak before rendering the app
initKeycloak()
  .then(() => {
    root.render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    )
  })
  .catch(err => {
    console.error('Keycloak init failed', err)
    // Still render the app even if Keycloak init fails
    root.render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>,
    )
  })
