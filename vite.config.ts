import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('reka-ui') || id.includes('@tanstack/vue-virtual'))
              return 'ui-vendor'
            if (id.includes('fuse.js'))
              return 'search'
            if (id.includes('date-fns'))
              return 'date'
            if (id.includes('@vueuse'))
              return 'vueuse'
            if (id.includes('vue/') || id.includes('vue/dist'))
              return 'vue'
          }
          if (id.includes('mock.json'))
            return 'data'
        },
      },
    },
  },
})
