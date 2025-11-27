import React, { useState, useEffect } from 'react'

/**
 * Component that shows a notification when a new version of the app is available
 * This component should be placed in the root layout
 */
function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    let registration = null

    if ('serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowPrompt(false) // Hide prompt after update is applied
      })

      // Check for updates
      navigator.serviceWorker.ready.then(sw => {
        registration = sw
        // Listen for new service worker installations
        sw.addEventListener('updatefound', () => {
          const newWorker = sw.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              setShowPrompt(true)
            }
          })
        })
      })
    }

    return () => {
      if (registration) {
        registration.removeEventListener('updatefound', () => {})
      }
    }
  }, [])

  const handleUpdate = () => {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister()
      }
    })
    // Reload after a short delay to ensure service worker is unregistered
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <p className="font-semibold">A new version is available!</p>
          <p className="text-sm opacity-90">Reload the app to get the latest features and improvements.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-white text-blue-600 hover:bg-gray-100 font-semibold transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAUpdatePrompt

