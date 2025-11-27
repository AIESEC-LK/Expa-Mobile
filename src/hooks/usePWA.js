/**
 * PWA Hook Utilities
 * Custom React hooks for PWA functionality
 */

import { useEffect, useState } from 'react'

/**
 * Hook to detect if the app is running in PWA/standalone mode
 * @returns {boolean} true if app is in standalone mode
 */
export function useStandalonePWA() {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true

    setIsStandalone(isStandaloneMode)

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleChange = (e) => setIsStandalone(e.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isStandalone
}

/**
 * Hook to check if the app is online/offline
 * @returns {boolean} true if online, false if offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook to detect if the app is PWA-installable
 * @returns {object} { isInstallable, install, prompt }
 */
export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsInstallable(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setIsInstallable(false)
    }
  }

  return {
    isInstallable,
    install,
    prompt: installPrompt
  }
}

/**
 * Hook to handle service worker updates
 * @returns {object} { isUpdateAvailable, updateApp, loading }
 */
export function useServiceWorkerUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setLoading(false)
      return
    }

    navigator.serviceWorker.ready
      .then(reg => {
        setRegistration(reg)
        setLoading(false)

        // Listen for updates
        const checkUpdate = () => {
          reg.update()
        }

        // Check for updates periodically
        const interval = setInterval(checkUpdate, 60000) // Every minute

        // Listen for service worker updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setIsUpdateAvailable(true)
            }
          })
        })

        return () => clearInterval(interval)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const updateApp = () => {
    if (!registration) return

    registration.unregister()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return {
    isUpdateAvailable,
    updateApp,
    loading
  }
}

/**
 * Hook to manage cache information
 * @returns {object} { cacheInfo, clearCache, loading }
 */
export function useCacheInfo() {
  const [cacheInfo, setCacheInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCacheInfo = async () => {
      if (!('caches' in window)) {
        setLoading(false)
        return
      }

      try {
        const cacheNames = await caches.keys()
        const sizes = {}

        for (const name of cacheNames) {
          const cache = await caches.open(name)
          const keys = await cache.keys()
          sizes[name] = keys.length
        }

        setCacheInfo({
          caches: cacheNames,
          sizes
        })
      } catch (error) {
        console.error('Failed to get cache info:', error)
      } finally {
        setLoading(false)
      }
    }

    getCacheInfo()
  }, [])

  const clearCache = async (cacheName = null) => {
    if (!('caches' in window)) return

    try {
      if (cacheName) {
        await caches.delete(cacheName)
      } else {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }

      // Refresh cache info
      const updatedCacheNames = await caches.keys()
      const updatedSizes = {}

      for (const name of updatedCacheNames) {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        updatedSizes[name] = keys.length
      }

      setCacheInfo({
        caches: updatedCacheNames,
        sizes: updatedSizes
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  return {
    cacheInfo,
    clearCache,
    loading
  }
}

