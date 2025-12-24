import React, { createContext, useContext, useEffect, useState } from 'react'
import initKeycloak, { getKeycloak, onAuthChange } from './keycloak'


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

    const initAuth = async () => {
      const kc = getKeycloak()

      if (kc && kc.didInitialize) {
        // Keycloak already initialized, use its state
        const isAuth = kc.isAuthenticated ?? !!kc.token
        setAuthenticated(isAuth)
        setProfile(isAuth ? kc.tokenParsed || null : null)
      } else {
        // Initialize Keycloak
        try {
          await initKeycloak()
          if (!mounted) return
          const keycloakInstance = getKeycloak()
          if (keycloakInstance?.refreshToken) {
            try {
              await keycloakInstance.updateToken(-1) // force refresh call
              if (keycloakInstance.token) localStorage.setItem('keycloak_token', keycloakInstance.token)
              if (keycloakInstance.refreshToken) localStorage.setItem('keycloak_refresh_token', keycloakInstance.refreshToken)
            } catch (e) {
              console.log("Failed to refresh token on init", e)
            }
          }
          if (keycloakInstance?.token) {
            setAuthenticated(true)
            setProfile(keycloakInstance.tokenParsed || null)
          } else {
            setAuthenticated(false)
            setProfile(null)
          }
        } catch (err) {
          if (mounted) {
            setAuthenticated(false)
            setProfile(null)
          }
        }
      }

      if (mounted) setLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const unsubscribe = onAuthChange((isAuth) => {
      if (!mounted) return
      const kc = getKeycloak()
      setAuthenticated(isAuth)
      setProfile(isAuth && kc ? kc.tokenParsed || null : null)
    })

    return () => {
      mounted = false
      if (typeof unsubscribe === 'function') unsubscribe()
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
      setAuthenticated(true)
      setProfile(kc.tokenParsed || null)
      if (kc.token) localStorage.setItem('keycloak_token', kc.token)
      if (kc.refreshToken) localStorage.setItem('keycloak_refresh_token', kc.refreshToken)
    } catch {
      setAuthenticated(false)
      setProfile(null)
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
