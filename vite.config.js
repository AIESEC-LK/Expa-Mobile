import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This makes the server accessible to all devices on the local network
    port: 5173,       // Optional, specify the port if needed
    strictPort: true, // Optional, forces Vite to use the specified port if it's available
  },
})
