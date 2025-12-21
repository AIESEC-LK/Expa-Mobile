/**
 * EXPA Mobile PWA Service Worker
 * Handles offline caching, background sync, and push notifications
 */

const CACHE_NAME = 'expa-v1'
const RUNTIME_CACHE = 'expa-runtime'
const IMAGE_CACHE = 'expa-images'
const API_CACHE = 'expa-api'

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/AIESEC-Human-Blue.png',
  '/White-Blue-Logo.png',
  '/Error.jpg',
]

// Install event - cache static assets
self.addEventListener('install', event => {
  //console.log('[ServiceWorker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      //console.log('[ServiceWorker] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[ServiceWorker] Some static assets failed to cache:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  //console.log('[ServiceWorker] Activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && !cacheName.includes('expa-')) {
            //console.log('[ServiceWorker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.includes('/graphql')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE))
    return
  }

  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE))
    return
  }

  // Handle document/navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE))
    return
  }

  // Handle other requests
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response
      }
      return fetch(request)
        .then(response => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response
          }
          const responseToCache = response.clone()
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // Return offline page if available
          if (request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          })
        })
    })
  )
})

/**
 * Network First Strategy
 * Try to fetch from network, fallback to cache
 */
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then(response => {
      if (!response || response.status !== 200) {
        return response
      }
      const responseToCache = response.clone()
      caches.open(cacheName).then(cache => {
        cache.put(request, responseToCache)
      })
      return response
    })
    .catch(() => {
      return caches.match(request).then(response => {
        if (response) {
          return response
        }
        // Return a fallback response
        return new Response('Offline - Resource not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        })
      })
    })
}

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request).then(response => {
    if (response) {
      return response
    }
    return fetch(request)
      .then(response => {
        if (!response || response.status !== 200) {
          return response
        }
        const responseToCache = response.clone()
        caches.open(cacheName).then(cache => {
          cache.put(request, responseToCache)
        })
        return response
      })
      .catch(() => {
        return new Response('Offline - Resource not available', {
          status: 503,
          statusText: 'Service Unavailable'
        })
      })
  })
}

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Handle push notifications (when implemented)
self.addEventListener('push', event => {
  //console.log('[ServiceWorker] Push notification received')
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/AIESEC-Human-Blue.png',
    badge: '/AIESEC-Human-Blue.png',
    tag: 'expa-notification',
    requireInteraction: false
  }
  event.waitUntil(
    self.registration.showNotification('EXPA', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  //console.log('[ServiceWorker] Notification clicked')
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

