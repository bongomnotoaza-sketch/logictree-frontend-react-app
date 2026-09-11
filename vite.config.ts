import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vueJsx()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/auth': 'http://127.0.0.1:4002',
      '/filesystem': 'http://127.0.0.1:4002',
      '/notes': 'http://127.0.0.1:4002',
      // '/intent': 'http://127.0.0.1:4002',   // uncomment when you wire up intent_clarifier
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})