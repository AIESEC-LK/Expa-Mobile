/**
 * PWA Configuration
 * Centralized configuration for PWA features
 * Customize this file to match your app's specific needs
 */

export const PWA_CONFIG = {
  // App Metadata
  app: {
    name: 'EXPA Mobile',
    shortName: 'EXPA',
    description: 'AIESEC EXPA Mobile Application - Manage applications and opportunities',
    version: '1.0.0',
  },

  // Display and Styling
  display: {
    themeColor: '#2B6CB0',        // AIESEC Blue
    backgroundColor: '#FFFFFF',
    displayMode: 'standalone',     // Options: 'standalone', 'fullscreen', 'minimal-ui', 'browser'
    orientation: 'portrait-primary', // Options: 'portrait', 'landscape', 'any'
  },

  // Icons Configuration
  icons: {
    favicon: '/AIESEC-Human-Blue.png',
    appleTouchIcon: '/AIESEC-Human-Blue.png',
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
      }
    ]
  },

  // Service Worker Configuration
  serviceWorker: {
    enabled: true,
    updateCheckInterval: 60000, // Check for updates every 1 minute
    cacheVersion: 'v1',
    strategy: 'autoUpdate', // Options: 'autoUpdate', 'prompt'
  },

  // Caching Configuration
  cache: {
    precache: {
      name: 'expa-v1',
      maxEntries: 100,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    },
    runtime: {
      name: 'expa-runtime',
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    },
    api: {
      name: 'expa-api',
      maxEntries: 50,
      maxAgeSeconds: 24 * 60 * 60, // 24 hours
    },
    auth: {
      name: 'expa-auth',
      maxEntries: 20,
      maxAgeSeconds: 60 * 60, // 1 hour
    },
    images: {
      name: 'expa-images',
      maxEntries: 200,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    },
  },

  // API Endpoints to Cache
  api: {
    endpoints: [
      {
        pattern: 'https://staging-jruby.aiesec.org/graphql',
        strategy: 'NetworkFirst',
        cacheName: 'expa-api',
        maxAgeSeconds: 24 * 60 * 60,
      },
      {
        pattern: 'https://auth.aiesec.lk/',
        strategy: 'NetworkFirst',
        cacheName: 'expa-auth',
        maxAgeSeconds: 60 * 60,
      },
    ]
  },

  // Shortcuts for App Launcher
  shortcuts: [
    {
      name: 'My Applications',
      short_name: 'Applications',
      description: 'View and manage your applications',
      url: '/app/icx/applications/my-opportunities',
      icons: [
        {
          src: '/AIESEC-Human-Blue.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
    {
      name: 'OGX Applications',
      short_name: 'OGX',
      description: 'View OGX applications',
      url: '/app/ogx',
      icons: [
        {
          src: '/AIESEC-Human-Blue.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    }
  ],

  // Screenshots for App Stores
  screenshots: [
    {
      src: '/AIESEC-Human-Blue.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow'
    }
  ],

  // Categories for app stores
  categories: ['productivity', 'business'],

  // Features
  features: {
    installable: true,
    offlineSupport: true,
    backgroundSync: false, // Ready but not yet implemented
    pushNotifications: false, // Ready but not yet implemented
    shareTarget: false,
    periodicBackground: false,
  },

  // Update Behavior
  updates: {
    checkOnLoad: true,
    autoUpdate: true,
    showPrompt: true,
    promptDelay: 0, // Immediately show prompt
  },

  // Network Configuration
  network: {
    timeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Development Configuration
  development: {
    enableLogging: true,
    logServiceWorkerMessages: true,
    simulateOffline: false, // Set to true to test offline
  },

  // Production Configuration
  production: {
    enableLogging: false,
    logServiceWorkerMessages: false,
    simulateOffline: false,
    enableCompression: true,
  },

  // Metadata
  author: 'AIESEC',
  licenseUrl: 'LICENSE',
  startUrl: '/',
  scope: '/',
};

/**
 * Get configuration based on environment
 */
export function getPWAConfig() {
  const isDev = import.meta.env.DEV;
  const config = { ...PWA_CONFIG };

  if (isDev) {
    config.development.enableLogging = true;
    config.development.logServiceWorkerMessages = true;
  } else {
    config.production.enableLogging = false;
  }

  return config;
}

/**
 * Validate PWA configuration
 */
export function validatePWAConfig(config = PWA_CONFIG) {
  const errors = [];

  // Validate required fields
  if (!config.app.name) errors.push('app.name is required');
  if (!config.display.themeColor) errors.push('display.themeColor is required');
  if (!config.icons.favicon) errors.push('icons.favicon is required');

  // Validate icon sizes
  const validSizes = ['192x192', '512x512'];
  config.icons.icons.forEach((icon, index) => {
    if (!validSizes.includes(icon.sizes)) {
      errors.push(`Icon ${index} has unsupported size: ${icon.sizes}`);
    }
  });

  // Validate shortcuts
  config.shortcuts.forEach((shortcut, index) => {
    if (!shortcut.url) errors.push(`Shortcut ${index} missing url`);
    if (!shortcut.name) errors.push(`Shortcut ${index} missing name`);
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Export PWA configuration for use in vite.config.js
 * This function is used by the Vite PWA plugin
 */
export function getVitePWAConfig() {
  const config = getPWAConfig();

  return {
    registerType: 'autoUpdate',
    includeAssets: [
      config.icons.favicon,
      config.icons.appleTouchIcon,
    ],
    manifest: {
      name: config.app.name,
      short_name: config.app.shortName,
      description: config.app.description,
      theme_color: config.display.themeColor,
      background_color: config.display.backgroundColor,
      display: config.display.displayMode,
      orientation: config.display.orientation,
      scope: config.scope,
      start_url: config.startUrl,
      icons: config.icons.icons,
      screenshots: config.screenshots,
      categories: config.categories,
      shortcuts: config.shortcuts,
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 5000000, // 5MB
      runtimeCaching: config.api.endpoints.map(endpoint => ({
        urlPattern: new RegExp(endpoint.pattern),
        handler: endpoint.strategy,
        options: {
          cacheName: endpoint.cacheName,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: endpoint.maxAgeSeconds
          }
        }
      }))
    }
  };
}

export default PWA_CONFIG;

