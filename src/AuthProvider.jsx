import React, { createContext, useContext, useEffect, useState } from 'react'
import initKeycloak, { getKeycloak } from './keycloak'

const AuthContext = createContext({
  authenticated: false,
  profile: null,
  login: () => {},
  logout: () => {},
  refresh: () => {},
  loading: true,
})

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Check if Keycloak is already initialized (it should be from main.jsx)
    // If not, initialize it here as a fallback
    const kc = getKeycloak()
    if (kc && kc.didInitialize) {
      // Keycloak already initialized, just set the state
      if (kc.token) {
        setAuthenticated(true)
        setProfile(kc.tokenParsed || null)
      } else {
        setAuthenticated(false)
        setProfile(null)
      }
      setLoading(false)
    } else {
      // Fallback: initialize if not already done
      initKeycloak()
        .then(() => {
          const keycloakInstance = getKeycloak()
          if (!mounted) return
          if (keycloakInstance && keycloakInstance.token) {
            setAuthenticated(true)
            setProfile(keycloakInstance.tokenParsed || null)
          } else {
            setAuthenticated(false)
            setProfile(null)
          }
          setLoading(false)
        })
        .catch(() => {
          if (mounted) setLoading(false)
        })
    }

    return () => {
      mounted = false
    }
  }, [])

  const login = () => {
    const kc = getKeycloak()
    if (kc) kc.login()
  }

  const logout = () => {
    const kc = getKeycloak()
    if (kc) kc.logout()
    localStorage.removeItem('aiesec_token')
    localStorage.removeItem('keycloak_token')
    localStorage.removeItem('keycloak_refresh_token')
    setAuthenticated(false)
    setProfile(null)
  }

  const refresh = async () => {
    const kc = getKeycloak()
    if (!kc) return
    try {
      await kc.updateToken(30)
      setProfile(kc.tokenParsed || null)
      try {
        if (kc.tokenParsed && kc.tokenParsed.aiesec_access_token) {
          const aiesec_access_token = JSON.parse(kc.tokenParsed.aiesec_access_token)
          localStorage.setItem('aiesec_token', aiesec_access_token)
        }
      } catch (e) {
        // ignore
      }
      localStorage.setItem('keycloak_token', kc.token)
      if (kc.refreshToken) localStorage.setItem('keycloak_refresh_token', kc.refreshToken)
    } catch (err) {
      console.error('refresh failed', err)
    }
  }

  return (
    <AuthContext.Provider value={{ authenticated, profile, login, logout, refresh, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider

