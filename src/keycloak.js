import Keycloak from 'keycloak-js'

let keycloak = null
let _onAuthChange = null

function safeLog(...args) {
    // debug disabled in production/dev cleanup
}

// Small JWT parse helper to get tokenParsed when rehydrating
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

/**
 * Initializes the Keycloak instance and handles the initial authentication flow.
 *
 * NOTE: We intentionally do NOT use the silent SSO check. The app requires an explicit
 * login flow (login is required) but we do not try to silently establish an SSO session.
 *
 * @param {function} [onAuthenticatedCallback] - Optional callback fired after successful authentication.
 * @returns {Promise<void>}
 */
function initKeycloak(onAuthenticatedCallback) {
    safeLog('initKeycloak called')
    return new Promise((resolve, reject) => {
        try {
            keycloak = new Keycloak({
                url: import.meta.env.VITE_KEYCLOAK_URL,
                realm: import.meta.env.VITE_KEYCLOAK_REALM,
                clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            })

            safeLog('keycloak instance created (not yet initialized)')

            // Attempt to rehydrate stored tokens BEFORE init so Keycloak instance has them
            try {
                const storedToken = localStorage.getItem('keycloak_token')
                const storedRefresh = localStorage.getItem('keycloak_refresh_token')
                if (storedToken) {
                    safeLog('rehydrate: found stored tokens before init; assigning to new instance (lengths)', storedToken.length, storedRefresh ? storedRefresh.length : 0)
                    // @ts-ignore
                    keycloak.token = storedToken
                    if (storedRefresh) keycloak.refreshToken = storedRefresh
                    // set tokenParsed for immediate consumption
                    try { keycloak.tokenParsed = parseJwt(storedToken) } catch (e) {}
                }
            } catch (e) {
                safeLog('rehydration before init failed', e)
            }

            // Build a silent-check-sso redirect URI that respects Vite's base path.
            // In hosted deployments the app may be served from a subpath (e.g. /app/), so
            // using window.location.origin + '/silent-check-sso.html' can point to the wrong location.
            const viteBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
            const silentCheckSsoRedirectUri = window.location.origin + (viteBase === '' || viteBase === '/' ? '' : viteBase) + '/silent-check-sso.html'
            safeLog('computed silentCheckSsoRedirectUri', silentCheckSsoRedirectUri)

            // Use native promises from keycloak-js
            keycloak
                .init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri,
                    checkLoginIframe: true,
                    checkLoginIframeInterval: 5
                })
                .then((authenticated) => {
                    safeLog('keycloak.init resolved', { authenticated })

                    // Mark that we've completed initialization so other modules can detect it
                    try {
                        keycloak.didInitialize = true
                        keycloak.isAuthenticated = !!authenticated
                    } catch (e) {
                        // ignore
                    }

                    safeLog('didInitialize/isAuthenticated set', { didInitialize: keycloak.didInitialize, isAuthenticated: keycloak.isAuthenticated })

                    // If authenticated is true, the user has a valid session.
                    if (authenticated) {
                        safeLog('init: authenticated === true; token present?', !!keycloak.token, 'refreshToken?', !!keycloak.refreshToken, 'username?', keycloak?.tokenParsed?.preferred_username || keycloak?.tokenParsed?.email)

                        // Persist tokens for existing app flows that read localStorage
                        try {
                            const raw = keycloak?.tokenParsed?.aiesec_access_token
                            let aiesec_access_token = raw
                            if (typeof raw === 'string') {
                                try {
                                    aiesec_access_token = JSON.parse(raw)
                                } catch (e) {
                                    // keep raw string if it's not JSON
                                    aiesec_access_token = raw
                                }
                            }
                            if (aiesec_access_token != null) {
                                localStorage.setItem('aiesec_token', aiesec_access_token)
                                safeLog('persisted aiesec_token')
                            } else {
                                safeLog('no aiesec_access_token found in tokenParsed')
                            }
                        } catch (e) {
                            console.warn('Failed to persist aiesec_access_token', e)
                        }

                        if (keycloak.refreshToken) {
                            localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken)
                            safeLog('persisted keycloak_refresh_token (length)', keycloak.refreshToken ? keycloak.refreshToken.length : 0)
                        }
                        if (keycloak.token) {
                            localStorage.setItem('keycloak_token', keycloak.token)
                            safeLog('persisted keycloak_token (length)', keycloak.token ? keycloak.token.length : 0)
                        }

                        if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
                    } else {
                        safeLog('init: authenticated === false; no session found')

                        // If we have a token in the instance (rehydrated from localStorage), try to validate it
                        if (keycloak.token) {
                            safeLog('init returned unauthenticated but token present; attempting updateToken to validate stored token')
                            keycloak.updateToken(10).then(() => {
                                safeLog('rehydration validation: updateToken succeeded after init; tokenPresent?', !!keycloak.token)
                                try { keycloak.isAuthenticated = true } catch (e) {}
                                if (keycloak.token) {
                                    localStorage.setItem('keycloak_token', keycloak.token)
                                }
                                if (keycloak.refreshToken) {
                                    localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken)
                                }
                                if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
                                if (typeof _onAuthChange === 'function') _onAuthChange(true)
                            }).catch(err => {
                                safeLog('rehydration validation: updateToken failed after init', err)
                                try { keycloak.isAuthenticated = false } catch (e) {}
                                // ensure we clear any stale tokens if validation fails
                                localStorage.removeItem('keycloak_token')
                                localStorage.removeItem('keycloak_refresh_token')
                                if (typeof _onAuthChange === 'function') _onAuthChange(false)
                            })
                        }
                    }

                    // --- Authentication Event Listeners ---

                    keycloak.onAuthSuccess = () => {
                        safeLog('event: onAuthSuccess fired', { tokenPresent: !!keycloak.token, refreshTokenPresent: !!keycloak.refreshToken })
                        try {
                            const raw = keycloak?.tokenParsed?.aiesec_access_token
                            let aiesec_access_token = raw
                            if (typeof raw === 'string') {
                                try {
                                    aiesec_access_token = JSON.parse(raw)
                                } catch (e) {
                                    aiesec_access_token = raw
                                }
                            }
                            if (aiesec_access_token != null) localStorage.setItem('aiesec_token', aiesec_access_token)
                        } catch (e) {
                            console.warn('onAuthSuccess: failed to persist aiesec_access_token', e)
                        }

                        if (keycloak.token) localStorage.setItem('keycloak_token', keycloak.token)
                        if (keycloak.refreshToken) localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken)
                        try { keycloak.isAuthenticated = true } catch (e) {}
                        if (typeof _onAuthChange === 'function') {
                            safeLog('onAuthSuccess: notifying _onAuthChange(true)')
                            _onAuthChange(true)
                        }
                    }

                    keycloak.onAuthLogout = () => {
                        safeLog('event: onAuthLogout fired')
                        localStorage.removeItem('aiesec_token')
                        localStorage.removeItem('keycloak_refresh_token')
                        localStorage.removeItem('keycloak_token')
                        try { keycloak.isAuthenticated = false } catch (e) {}
                        if (typeof _onAuthChange === 'function') {
                            safeLog('onAuthLogout: notifying _onAuthChange(false)')
                            _onAuthChange(false)
                        }
                    }

                    keycloak.onTokenExpired = () => {
                        safeLog('event: onTokenExpired fired - attempting silent token refresh')
                        // Try to refresh token automatically
                        keycloak.updateToken(30).then(() => {
                            safeLog('onTokenExpired: updateToken succeeded; tokenPresent?', !!keycloak.token)
                            try { keycloak.isAuthenticated = true } catch (e) {}
                            if (typeof _onAuthChange === 'function') {
                                safeLog('onTokenExpired: notifying _onAuthChange(true)')
                                _onAuthChange(true)
                            }
                        }).catch(() => {
                            console.error('Failed to refresh token.')
                            // If refresh fails, notify listeners so UI can react
                            try { keycloak.isAuthenticated = false } catch (e) {}
                            if (typeof _onAuthChange === 'function') {
                                safeLog('onTokenExpired: notifying _onAuthChange(false)')
                                _onAuthChange(false)
                            }
                        })
                    }

                    safeLog('keycloak.init setup complete; resolving')
                    resolve()
                })
                .catch((err) => {
                    console.error('Keycloak initialization failed:', err)
                    reject(err)
                })
        } catch (err) {
            reject(err)
        }
    })
}

function logout() {
    safeLog('logout called')
    if (!keycloak) return
    // keycloak.logout() handles the clearing of tokens from Keycloak and redirects
    keycloak.logout()
    localStorage.removeItem('aiesec_token')
    localStorage.removeItem('keycloak_token')
    localStorage.removeItem('keycloak_refresh_token')
}

function getKeycloak() {
    safeLog('getKeycloak called; returning instance present?', !!keycloak, 'didInitialize?', keycloak?.didInitialize, 'isAuthenticated?', keycloak?.isAuthenticated)
    return keycloak
}

function onAuthChange(cb) {
    safeLog('onAuthChange called; registering callback')
    _onAuthChange = cb
    // Return unsubscribe function
    return () => {
        safeLog('onAuthChange: unsubscribe called')
        if (_onAuthChange === cb) _onAuthChange = null
    }
}

export { keycloak, getKeycloak, onAuthChange, logout }
export default initKeycloak