import Keycloak from 'keycloak-js'

let keycloak = null
let _onAuthChange = null
let _explicitLogout = false
let _rehydratedRefreshToken = null

function mask(t) {
  try {
    if (!t) return null
    return typeof t === 'string' ? t.slice(0, 10) + '...' : String(t)
  } catch (e) {
    return '***'
  }
}

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch (e) {
    console.log('[KEYCLOAK] parseJwt failed', e)
    return null
  }
}

function initKeycloak(onAuthenticatedCallback) {
  return new Promise((resolve, reject) => {
    try {
      console.log('[KEYCLOAK] initKeycloak starting - env:', {
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        baseUrl: import.meta.env.BASE_URL,
      })

      keycloak = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
      })

      // Rehydrate stored tokens (if any)
      try {
        const storedTokenRaw = localStorage.getItem('keycloak_token')
        const storedRefreshRaw = localStorage.getItem('keycloak_refresh_token')
        console.log('[KEYCLOAK] rehydration - localStorage keycloak_token present:', !!storedTokenRaw, 'keycloak_refresh_token present:', !!storedRefreshRaw)
        const token = storedTokenRaw && storedTokenRaw !== 'undefined' && storedTokenRaw !== 'null' ? storedTokenRaw : null
        const refresh = storedRefreshRaw && storedRefreshRaw !== 'undefined' && storedRefreshRaw !== 'null' ? storedRefreshRaw : null
        if (token) {
          // @ts-ignore - we assign into the keycloak instance before init
          keycloak.token = token
          if (refresh) {
            keycloak.refreshToken = refresh
            _rehydratedRefreshToken = refresh
          }
          keycloak.tokenParsed = parseJwt(token)
          console.log('[KEYCLOAK] rehydrated token (masked):', mask(token), 'rehydrated refresh (masked):', mask(refresh))
        } else {
          if (storedTokenRaw) localStorage.removeItem('keycloak_token')
          if (storedRefreshRaw) localStorage.removeItem('keycloak_refresh_token')
          console.log('[KEYCLOAK] removed invalid stored tokens from localStorage')
        }
      } catch (e) {
        console.log('[KEYCLOAK] error during token rehydration', e)
        // If rehydration fails, continue without tokens
      }

      const viteBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
      const silentCheckSsoRedirectUri = window.location.origin + (viteBase === '' || viteBase === '/' ? '' : viteBase) + '/silent-check-sso.html'
      console.log('[KEYCLOAK] silentCheckSsoRedirectUri =', silentCheckSsoRedirectUri)

      keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoFallback: false,
          checkLoginIframe: true,
          checkLoginIframeInterval: 5,
        })
        .then((authenticated) => {
          console.log('[KEYCLOAK] init().then - authenticated =', authenticated)
          try { keycloak.didInitialize = true } catch (e) {}
          try { keycloak.isAuthenticated = !!authenticated } catch (e) {}

          const persistTokens = () => {
            console.log('[KEYCLOAK] persistTokens - token present:', !!keycloak.token, 'refresh present:', !!keycloak.refreshToken)
            if (keycloak.token) localStorage.setItem('keycloak_token', keycloak.token)
            else localStorage.removeItem('keycloak_token')
            if (keycloak.refreshToken) localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken)
            else localStorage.removeItem('keycloak_refresh_token')

            // keep backward-compatible aiesec token if present in tokenParsed
            try {
              const raw = keycloak?.tokenParsed?.aiesec_access_token
              let aiesec_access_token = raw
              if (typeof raw === 'string') {
                try { aiesec_access_token = JSON.parse(raw) } catch (_) { aiesec_access_token = raw }
              }
              if (aiesec_access_token != null) {
                localStorage.setItem('aiesec_token', aiesec_access_token)
                console.log('[KEYCLOAK] persisted aiesec_token')
              }
            } catch (e) {
              console.log('[KEYCLOAK] error while persisting aiesec_token', e)
            }
            console.log('[KEYCLOAK] after persist - localStorage keycloak_token masked:', mask(localStorage.getItem('keycloak_token')))
          }

          if (authenticated) {
            persistTokens()
            if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
          } else {
            // If we had a rehydrated token, try to validate it
            if (keycloak.token) {
              if (!keycloak.refreshToken && _rehydratedRefreshToken) {
                keycloak.refreshToken = _rehydratedRefreshToken
              }
              console.log('[KEYCLOAK] not authenticated but rehydrated token exists - attempting updateToken(10)')
              keycloak.updateToken(10).then(() => {
                console.log('[KEYCLOAK] updateToken(10) success - marking authenticated')
                try { keycloak.isAuthenticated = true } catch (e) {}
                persistTokens()
                if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
                if (typeof _onAuthChange === 'function') _onAuthChange(true)
              }).catch((err) => {
                console.log('[KEYCLOAK] updateToken(10) failed', err)
                try { keycloak.isAuthenticated = false } catch (e) {}
                // localStorage.removeItem('keycloak_token')
                // localStorage.removeItem('keycloak_refresh_token')
                if (typeof _onAuthChange === 'function') _onAuthChange(false)
                try {
                  if (keycloak.token || keycloak.refreshToken) {
                    console.log('[KEYCLOAK] attempting login redirect because token validation failed')
                    keycloak.login({ redirectUri: window.location.href })
                  }
                } catch (e) {
                  console.log('[KEYCLOAK] error during login redirect attempt', e)
                }
              })
            }
          }

          // Events
          keycloak.onAuthSuccess = () => {
            console.log('[KEYCLOAK] onAuthSuccess fired - persisting tokens')
            persistTokens()
            try { keycloak.isAuthenticated = true } catch (e) {}
            if (typeof _onAuthChange === 'function') _onAuthChange(true)
          }

          keycloak.onAuthLogout = () => {
            console.log('[KEYCLOAK] onAuthLogout fired - clearing tokens from localStorage')
            if (_explicitLogout) {
              localStorage.removeItem('aiesec_token')
              localStorage.removeItem('keycloak_refresh_token')
              localStorage.removeItem('keycloak_token')
            }
            _explicitLogout = false
            try { keycloak.isAuthenticated = false } catch (e) {}
            if (typeof _onAuthChange === 'function') _onAuthChange(false)
          }

          keycloak.onTokenExpired = () => {
            console.log('[KEYCLOAK] onTokenExpired fired - refreshToken present:', !!keycloak.refreshToken)
            if (!keycloak.refreshToken) {
              try { keycloak.isAuthenticated = false } catch (e) {}
              localStorage.removeItem('keycloak_token')
              localStorage.removeItem('keycloak_refresh_token')
              if (typeof _onAuthChange === 'function') _onAuthChange(false)
              return
            }

            keycloak.updateToken(30).then(() => {
              console.log('[KEYCLOAK] onTokenExpired -> updateToken(30) succeeded')
              try { keycloak.isAuthenticated = true } catch (e) {}
              if (typeof _onAuthChange === 'function') _onAuthChange(true)
            }).catch((err) => {
              console.log('[KEYCLOAK] onTokenExpired -> updateToken(30) failed', err)
              try { keycloak.isAuthenticated = false } catch (e) {}
              if (typeof _onAuthChange === 'function') _onAuthChange(false)
            })
          }

          resolve()
        })
        .catch((err) => {
          console.log('[KEYCLOAK] init failed', err)
          reject(err)
        })
    } catch (err) {
      console.log('[KEYCLOAK] unexpected error in initKeycloak', err)
      reject(err)
    }
  })
}

function logout() {
  if (!keycloak) return
  _explicitLogout = true
    console.log('[KEYCLOAK] logout called - delegating to keycloak.logout() and clearing tokens from localStorage')
  try { keycloak.logout() } catch (e) { console.log('[KEYCLOAK] logout error', e) }
  localStorage.removeItem('aiesec_token')
  localStorage.removeItem('keycloak_token')
  localStorage.removeItem('keycloak_refresh_token')
  console.log('[KEYCLOAK] logout completed - cleared tokens from localStorage')
}

function getKeycloak() {
  return keycloak
}

function onAuthChange(cb) {
  _onAuthChange = cb
  return () => { if (_onAuthChange === cb) _onAuthChange = null }
}

export { keycloak, getKeycloak, onAuthChange, logout }
export default initKeycloak

