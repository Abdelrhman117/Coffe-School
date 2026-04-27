import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
          if (id.includes('firebase/')) return 'firebase'
          if (id.includes('gsap')) return 'gsap'
        },
      },
    },
  },
})
