import Keycloak from 'keycloak-js'

let keycloak = null
let _onAuthChange = null

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch (e) {
    return null
  }
}

function initKeycloak(onAuthenticatedCallback) {
  return new Promise((resolve, reject) => {
    try {
      keycloak = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_URL,
        realm: import.meta.env.VITE_KEYCLOAK_REALM,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
      })

      // Rehydrate stored tokens (if any)
      try {
        const storedTokenRaw = localStorage.getItem('keycloak_token')
        const storedRefreshRaw = localStorage.getItem('keycloak_refresh_token')
        const token = storedTokenRaw && storedTokenRaw !== 'undefined' && storedTokenRaw !== 'null' ? storedTokenRaw : null
        const refresh = storedRefreshRaw && storedRefreshRaw !== 'undefined' && storedRefreshRaw !== 'null' ? storedRefreshRaw : null
        if (token) {
          // @ts-ignore - we assign into the keycloak instance before init
          keycloak.token = token
          if (refresh) keycloak.refreshToken = refresh
          keycloak.tokenParsed = parseJwt(token)
        } else {
          if (storedTokenRaw) localStorage.removeItem('keycloak_token')
          if (storedRefreshRaw) localStorage.removeItem('keycloak_refresh_token')
        }
      } catch (e) {
        // If rehydration fails, continue without tokens
      }

      const viteBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
      const silentCheckSsoRedirectUri = window.location.origin + (viteBase === '' || viteBase === '/' ? '' : viteBase) + '/silent-check-sso.html'

      keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoFallback: false,
          checkLoginIframe: true,
          checkLoginIframeInterval: 5,
        })
        .then((authenticated) => {
          try { keycloak.didInitialize = true } catch (e) {}
          try { keycloak.isAuthenticated = !!authenticated } catch (e) {}

          const persistTokens = () => {
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
              if (aiesec_access_token != null) localStorage.setItem('aiesec_token', aiesec_access_token)
            } catch (e) {}
          }

          if (authenticated) {
            persistTokens()
            if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
          } else {
            // If we had a rehydrated token, try to validate it
            if (keycloak.token) {
              keycloak.updateToken(10).then(() => {
                try { keycloak.isAuthenticated = true } catch (e) {}
                persistTokens()
                if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
                if (typeof _onAuthChange === 'function') _onAuthChange(true)
              }).catch(() => {
                try { keycloak.isAuthenticated = false } catch (e) {}
                // localStorage.removeItem('keycloak_token')
                // localStorage.removeItem('keycloak_refresh_token')
                if (typeof _onAuthChange === 'function') _onAuthChange(false)
                try {
                  if (keycloak.token || keycloak.refreshToken) {
                    keycloak.login({ redirectUri: window.location.href })
                  }
                } catch (e) {}
              })
            }
          }

          // Events
          keycloak.onAuthSuccess = () => {
            persistTokens()
            try { keycloak.isAuthenticated = true } catch (e) {}
            if (typeof _onAuthChange === 'function') _onAuthChange(true)
          }

          keycloak.onAuthLogout = () => {
            localStorage.removeItem('aiesec_token')
            localStorage.removeItem('keycloak_refresh_token')
            localStorage.removeItem('keycloak_token')
            try { keycloak.isAuthenticated = false } catch (e) {}
            if (typeof _onAuthChange === 'function') _onAuthChange(false)
          }

          keycloak.onTokenExpired = () => {
            if (!keycloak.refreshToken) {
              try { keycloak.isAuthenticated = false } catch (e) {}
              localStorage.removeItem('keycloak_token')
              localStorage.removeItem('keycloak_refresh_token')
              if (typeof _onAuthChange === 'function') _onAuthChange(false)
              return
            }

            keycloak.updateToken(30).then(() => {
              try { keycloak.isAuthenticated = true } catch (e) {}
              if (typeof _onAuthChange === 'function') _onAuthChange(true)
            }).catch(() => {
              try { keycloak.isAuthenticated = false } catch (e) {}
              if (typeof _onAuthChange === 'function') _onAuthChange(false)
            })
          }

          resolve()
        })
        .catch((err) => reject(err))
    } catch (err) {
      reject(err)
    }
  })
}

function logout() {
  if (!keycloak) return
  try { keycloak.logout() } catch (e) {}
  localStorage.removeItem('aiesec_token')
  localStorage.removeItem('keycloak_token')
  localStorage.removeItem('keycloak_refresh_token')
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