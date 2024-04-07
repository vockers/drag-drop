import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    host: true,
    port: 8080,
    strictPort: true,
  }
})
