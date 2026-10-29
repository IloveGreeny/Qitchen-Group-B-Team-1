import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, send every /api request to the Express server.
    // The browser only ever talks to localhost:5173, so login cookies just work.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
