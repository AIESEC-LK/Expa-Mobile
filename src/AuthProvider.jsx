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

function maskToken(t) {
  try {
    if (!t) return null
    return typeof t === 'string' ? t.slice(0, 10) + '...' : String(t)
  } catch (e) {
    return '***'
  }
}

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    console.log('[AUTH] AuthProvider mount - loading state:', loading)

    // Optional localStorage debugging. Enable by setting VITE_DEBUG_LOCALSTORAGE=true in env.
    const debugLocalStorage = import.meta.env.VITE_DEBUG_LOCALSTORAGE === 'true'
    let _origSet = null
    let _origRemove = null
    let _origClear = null
    if (debugLocalStorage) {
      try {
        _origSet = localStorage.setItem
        _origRemove = localStorage.removeItem
        _origClear = localStorage.clear

        const interestingKeys = ['keycloak_token', 'keycloak_refresh_token', 'aiesec_token']

        localStorage.setItem = function (key, value) {
          try {
            _origSet.call(this, key, value)
          } catch (e) {
            // still attempt to log
          }
          if (interestingKeys.includes(key)) {
            console.log('[AUTH][LS][SET] key:', key, 'value:', maskToken(value))
            console.trace('[AUTH][LS][SET] stack')
          }
        }

        localStorage.removeItem = function (key) {
          try { _origRemove.call(this, key) } catch (e) {}
          if (interestingKeys.includes(key)) {
            console.log('[AUTH][LS][REMOVE] key:', key)
            console.trace('[AUTH][LS][REMOVE] stack')
          }
        }

        localStorage.clear = function () {
          try { _origClear.call(this) } catch (e) {}
          console.log('[AUTH][LS][CLEAR] localStorage.clear() called')
          console.trace('[AUTH][LS][CLEAR] stack')
        }

        console.log('[AUTH][LS] debug wrapper installed for localStorage')
      } catch (e) {
        console.log('[AUTH][LS] failed to install debug wrapper', e)
      }
    }

    const initAuth = async () => {
      console.log('[AUTH] initAuth - retrieving keycloak instance')
      const kc = getKeycloak()

      if (kc && kc.didInitialize) {
        console.log('[AUTH] Keycloak already initialized. didInitialize=true')
        // Keycloak already initialized, use its state
        const isAuth = kc.isAuthenticated ?? !!kc.token
        console.log('[AUTH] existing kc state - isAuthenticated:', isAuth, 'token:', maskToken(kc.token))
        setAuthenticated(isAuth)
        setProfile(isAuth ? kc.tokenParsed || null : null)
      } else {
        // Initialize Keycloak
        try {
          console.log('[AUTH] calling initKeycloak()')
          await initKeycloak()
          if (!mounted) {
            console.log('[AUTH] component unmounted during init - aborting')
            return
          }
          const keycloakInstance = getKeycloak()
          console.log('[AUTH] keycloak instance after init - token:', maskToken(keycloakInstance?.token), 'refreshToken:', maskToken(keycloakInstance?.refreshToken))
          if (keycloakInstance?.refreshToken) {
            try {
              console.log('[AUTH] attempting forced updateToken(-1) on init to validate refreshToken')
              await keycloakInstance.updateToken(-1) // force refresh call
              console.log('[AUTH] updateToken(-1) succeeded - new token:', maskToken(keycloakInstance.token))
              if (keycloakInstance.token) localStorage.setItem('keycloak_token', keycloakInstance.token)
              if (keycloakInstance.refreshToken) localStorage.setItem('keycloak_refresh_token', keycloakInstance.refreshToken)
            } catch (e) {
              console.log('[AUTH] Failed to refresh token on init', e)
            }
          }
          if (keycloakInstance?.token) {
            console.log('[AUTH] token present after init - setting authenticated true')
            setAuthenticated(true)
            setProfile(keycloakInstance.tokenParsed || null)
          } else {
            console.log('[AUTH] no token after init - setting authenticated false')
            setAuthenticated(false)
            setProfile(null)
          }
        } catch (err) {
          console.log('[AUTH] initKeycloak() threw error', err)
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
      console.log('[AUTH] onAuthChange fired - isAuth:', isAuth, 'kc token:', maskToken(kc?.token))
      setAuthenticated(isAuth)
      setProfile(isAuth && kc ? kc.tokenParsed || null : null)
    })

    // Storage event listener to detect external/local removals (other tabs, service worker, redirects)
    const storageHandler = (e) => {
      try {
        if (!e) return
        const interestingKeys = ['keycloak_token', 'keycloak_refresh_token', 'aiesec_token']
        if (!interestingKeys.includes(e.key)) return
        console.log('[AUTH][STORAGE] storage event - key:', e.key, 'oldValue:', maskToken(e.oldValue), 'newValue:', maskToken(e.newValue), 'url:', e.url || e.uri || window.location.href)
        if (e.newValue == null) {
          // token removed externally
          console.warn('[AUTH][STORAGE] token key removed externally:', e.key)
          // print stack so we can see where it might be coming from
          console.trace('[AUTH][STORAGE] stack trace for removal')
        }
      } catch (err) {
        console.log('[AUTH][STORAGE] storage handler error', err)
      }
    }

    window.addEventListener('storage', storageHandler)

    return () => {
      mounted = false
      if (typeof unsubscribe === 'function') unsubscribe()
      try { window.removeEventListener('storage', storageHandler) } catch (e) {}
      // restore localStorage functions if we wrapped them
      if (debugLocalStorage) {
        try {
          if (_origSet) localStorage.setItem = _origSet
          if (_origRemove) localStorage.removeItem = _origRemove
          if (_origClear) localStorage.clear = _origClear
          console.log('[AUTH][LS] debug wrapper removed')
        } catch (e) {
          console.log('[AUTH][LS] failed to restore original localStorage methods', e)
        }
      }
    }
  }, [])

  const login = () => {
    console.log('[AUTH] login() called')
    const kc = getKeycloak()
    if (kc) {
      console.log('[AUTH] delegating to keycloak.login()')
      kc.login()
    } else {
      console.log('[AUTH] login: keycloak instance not available')
    }
  }

  const logout = () => {
    console.log('[AUTH] logout() called - clearing localStorage and delegating to keycloak.logout if available')
    const kc = getKeycloak()
    if (kc) kc.logout()
    localStorage.removeItem('aiesec_token')
    localStorage.removeItem('keycloak_token')
    localStorage.removeItem('keycloak_refresh_token')
    setAuthenticated(false)
    setProfile(null)
  }

  const refresh = async () => {
    console.log('[AUTH] refresh() called - attempting kc.updateToken(30)')
    const kc = getKeycloak()
    if (!kc) {
      console.log('[AUTH] refresh: no keycloak instance')
      return
    }
    try {
      await kc.updateToken(30)
      console.log('[AUTH] refresh succeeded - token now:', maskToken(kc.token))
      setAuthenticated(true)
      setProfile(kc.tokenParsed || null)
      if (kc.token) localStorage.setItem('keycloak_token', kc.token)
      if (kc.refreshToken) localStorage.setItem('keycloak_refresh_token', kc.refreshToken)
    } catch (err) {
      console.log('[AUTH] refresh failed', err)
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
