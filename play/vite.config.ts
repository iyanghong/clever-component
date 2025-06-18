import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../packages'),
      '@clever-component': resolve(__dirname, '../packages')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})