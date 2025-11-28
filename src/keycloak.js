import Keycloak from 'keycloak-js'

let keycloak = null
let _onAuthChange = null

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
    return new Promise((resolve, reject) => {
        try {
            keycloak = new Keycloak({
                url: import.meta.env.VITE_KEYCLOAK_URL,
                realm: import.meta.env.VITE_KEYCLOAK_REALM,
                clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            })

            // Use native promises from keycloak-js
            keycloak
                .init({
                    // Require interactive login when the app starts
                    onLoad: 'login-required',
                    promiseType: 'native',
                    // Recommended PKCE method for public clients
                    pkceMethod: 'S256',
                    checkLoginIframe: false,
                })
                .then((authenticated) => {
                    // If authenticated is true, the user has a valid session.
                    if (authenticated) {
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
                            }
                        } catch (e) {
                            console.warn('Failed to persist aiesec_access_token', e)
                        }

                        if (keycloak.refreshToken) localStorage.setItem('keycloak_refresh_token', keycloak.refreshToken)
                        if (keycloak.token) localStorage.setItem('keycloak_token', keycloak.token)

                        if (typeof onAuthenticatedCallback === 'function') onAuthenticatedCallback()
                    }

                    // --- Authentication Event Listeners ---

                    keycloak.onAuthSuccess = () => {
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
                        if (typeof _onAuthChange === 'function') _onAuthChange(true)
                    }

                    keycloak.onAuthLogout = () => {
                        localStorage.removeItem('aiesec_token')
                        localStorage.removeItem('keycloak_refresh_token')
                        localStorage.removeItem('keycloak_token')
                        if (typeof _onAuthChange === 'function') _onAuthChange(false)
                    }

                    keycloak.onTokenExpired = () => {
                        // Try to refresh token automatically
                        keycloak.updateToken(30).catch(() => {
                            console.error('Failed to refresh token.')
                            // If refresh fails, notify listeners so UI can react
                            if (typeof _onAuthChange === 'function') _onAuthChange(false)
                        })
                    }

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
    if (!keycloak) return
    // keycloak.logout() handles the clearing of tokens from Keycloak and redirects
    keycloak.logout()
    localStorage.removeItem('aiesec_token')
    localStorage.removeItem('keycloak_token')
    localStorage.removeItem('keycloak_refresh_token')
}

function getKeycloak() {
    return keycloak
}

function onAuthChange(cb) {
    _onAuthChange = cb
}

export { keycloak, getKeycloak, onAuthChange, logout }
export default initKeycloak