import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages'),
      '@clever-component': resolve(__dirname, 'packages')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
})