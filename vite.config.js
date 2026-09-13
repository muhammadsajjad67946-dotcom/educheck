import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'https://educheck-y15k-404zic8ud-muhammadsajjad67946-6238s-projects.vercel.app',
    },
  },
})
