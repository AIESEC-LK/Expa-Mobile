import React, { createContext, useContext, useEffect, useState } from 'react'
import initKeycloak, { getKeycloak, onAuthChange } from './keycloak'

function safeLog(...args) {
  // debug disabled
}

// Helper to decode a JWT without external deps
function parseJwt(token) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    try {
      return JSON.parse(decodeURIComponent(escape(decoded)))
    } catch (e) {
      return JSON.parse(decoded)
    }
  } catch (e) {
    return null
  }
}

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
    safeLog('useEffect mount: checking keycloak instance')

    // Check if Keycloak is already initialized (it should be from main.jsx)
    // If not, initialize it here as a fallback
    const kc = getKeycloak()
    safeLog('getKeycloak returned', { present: !!kc, didInitialize: kc?.didInitialize, isAuthenticated: kc?.isAuthenticated, tokenPresent: !!kc?.token })
    if (kc && kc.didInitialize) {
      // Keycloak already initialized, just set the state
      const isAuth = kc.isAuthenticated ?? !!kc.token
      safeLog('kc.didInitialize true; using existing state', { isAuth })
      if (isAuth) {
        setAuthenticated(true)
        setProfile(kc.tokenParsed || null)
        setLoading(false)
      } else {
        // Attempt to rehydrate from localStorage if tokens exist
        const storedToken = localStorage.getItem('keycloak_token')
        const storedRefresh = localStorage.getItem('keycloak_refresh_token')
        safeLog('kc reports unauthenticated; checking localStorage tokens', { storedTokenPresent: !!storedToken, storedRefreshPresent: !!storedRefresh })
        if (storedToken) {
          try {
            safeLog('rehydrating keycloak instance with stored tokens (optimistic)')
            // @ts-ignore - assign token/refreshToken directly
            kc.token = storedToken
            if (storedRefresh) kc.refreshToken = storedRefresh
            // Optimistically consider user authenticated while we validate
            setAuthenticated(true)
            setProfile(kc.tokenParsed || null)
            setLoading(true)
            // Try to validate token by updating it
            kc.updateToken(10).then(() => {
              safeLog('rehydration: updateToken succeeded')
              try { kc.isAuthenticated = true } catch (e) {}
              setAuthenticated(true)
              setProfile(kc.tokenParsed || null)
              setLoading(false)
            }).catch(err => {
              safeLog('rehydration: updateToken failed', err)
              try { kc.isAuthenticated = false } catch (e) {}
              setAuthenticated(false)
              setProfile(null)
              setLoading(false)
            })
          } catch (e) {
            safeLog('rehydration: unexpected error', e)
            setAuthenticated(false)
            setProfile(null)
            setLoading(false)
          }
        } else {
          setAuthenticated(false)
          setProfile(null)
          setLoading(false)
        }
      }
      safeLog('AuthProvider initial state from existing keycloak set (async rehydration may be in progress)', { authenticated: isAuth, loading: loading })
    } else {
      // Fallback: initialize if not already done
      safeLog('kc not initialized; calling initKeycloak()')
      initKeycloak()
        .then(() => {
          const keycloakInstance = getKeycloak()
          if (!mounted) return
          safeLog('initKeycloak resolved in AuthProvider; keycloakInstance:', { present: !!keycloakInstance, tokenPresent: !!keycloakInstance?.token })
          if (keycloakInstance && keycloakInstance.token) {
            setAuthenticated(true)
            setProfile(keycloakInstance.tokenParsed || null)
            safeLog('set authenticated true after init')
          } else {
            setAuthenticated(false)
            setProfile(null)
            safeLog('no token after init; set authenticated false')
          }
          setLoading(false)
        })
        .catch((err) => {
          safeLog('initKeycloak failed in AuthProvider', err)
          if (mounted) setLoading(false)
        })
    }

    // Register listener for auth state changes from Keycloak
    const handleAuthChange = (isAuthenticated) => {
      if (!mounted) return
      const kc2 = getKeycloak()
      safeLog('handleAuthChange called', { isAuthenticated, kcPresent: !!kc2, tokenPresent: !!kc2?.token, tokenLength: kc2?.token?.length })
      setAuthenticated(isAuthenticated)
      if (isAuthenticated && kc2) {
        setProfile(kc2.tokenParsed || null)
      } else {
        setProfile(null)
      }
    }

    const unsubscribe = onAuthChange(handleAuthChange)
    safeLog('registered auth change listener; unsubscribe provided?', typeof unsubscribe === 'function')

    return () => {
      mounted = false
      safeLog('useEffect cleanup; unsubscribing')
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const login = () => {
    const kc = getKeycloak()
    safeLog('login called; kc present?', !!kc)
    if (kc) kc.login()
  }

  const logout = () => {
    const kc = getKeycloak()
    safeLog('logout called; kc present?', !!kc)
    if (kc) kc.logout()
    localStorage.removeItem('aiesec_token')
    localStorage.removeItem('keycloak_token')
    localStorage.removeItem('keycloak_refresh_token')
    setAuthenticated(false)
    setProfile(null)
  }

  const refresh = async () => {
    const kc = getKeycloak()
    safeLog('refresh called; kc present?', !!kc)
    if (!kc) return
    try {
      safeLog('calling kc.updateToken(30)')
      await kc.updateToken(30)
      // updateToken succeeded; ensure auth state reflects that
      setAuthenticated(true)
      setProfile(kc.tokenParsed || null)
      safeLog('updateToken succeeded; tokenPresent?', !!kc.token, 'tokenLength', kc.token ? kc.token.length : 0)
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
      safeLog('updateToken failed in refresh', err)
      // If updateToken fails, mark unauthenticated
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
