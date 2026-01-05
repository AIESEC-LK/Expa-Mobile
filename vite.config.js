import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['AIESEC-Human-Blue.png', 'White-Blue-Logo.png'],
      manifest: {
        name: 'EXPA Mobile',
        short_name: 'EXPA Mobile',
        description: 'AIESEC EXPA Mobile Application - Manage applications and opportunities',
        theme_color: '#2B6CB0',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/AIESEC-Human-Blue.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/AIESEC-Human-Blue.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/AIESEC-Human-Blue.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/AIESEC-Human-Blue.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ],
        categories: ['productivity'],
        shortcuts: [
          {
            name: 'My Applications',
            short_name: 'Applications',
            description: 'View and manage your applications',
            url: '/app/icx/applications/my-opportunities',
            icons: [{ src: '/AIESEC-Human-Blue.png', sizes: '192x192' }]
          },
          {
            name: 'OGX Applications',
            short_name: 'OGX',
            description: 'View OGX applications',
            url: '/app/ogx',
            icons: [{ src: '/AIESEC-Human-Blue.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/staging-jruby\.aiesec\.org\/graphql/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'graphql-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/auth\.aiesec\.lk\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'auth-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',  // This makes the server accessible to all devices on the local network
    port: 5173,       // Optional, specify the port if needed
    strictPort: true, // Optional, forces Vite to use the specified port if it's available
  },
})
