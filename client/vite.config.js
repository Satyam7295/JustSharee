import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)),
        }),
        autoprefixer(),
      ],
    },
  },
  server: {
    proxy: {
      '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:6600',
    },
  },
})