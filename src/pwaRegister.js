/**
 * PWA Service Worker Registration
 * This module handles the registration and updates of the service worker
 */

export function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          //console.log('✓ Service Worker registered successfully:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, notify user
                showUpdatePrompt()
              }
            })
          })
        })
        .catch(error => {
          console.error('✗ Service Worker registration failed:', error)
        })
    })
  }
}

/**
 * Show a prompt when a new version is available
 */
function showUpdatePrompt() {
  if (confirm('A new version of EXPA is available! Would you like to update?')) {
    // Reload to get the new version
    window.location.reload()
  }
}

/**
 * Check if the app is installed as PWA
 */
export function isInstalledAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

/**
 * Get the display mode of the app
 */
export function getDisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if (isStandalone) {
    return 'standalone'
  }
  if (window.navigator.standalone === true) {
    return 'standalone'
  }
  return 'browser'
}

