import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['html2pdf.js', 'firebase/app', 'firebase/firestore', 'firebase/analytics']
  }
})
