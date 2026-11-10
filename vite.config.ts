import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'vue-router/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    VueRouter({ dts: 'src/route-map.d.ts', watch: command === 'serve' }),
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
