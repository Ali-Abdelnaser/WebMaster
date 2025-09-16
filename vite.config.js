import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // زود الحد من 500KB لـ 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three', 'framer-motion'] // قسم المكتبات الكبيرة
        }
      }
    }
  }
})
