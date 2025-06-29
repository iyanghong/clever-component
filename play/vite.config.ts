import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../packages'),
      '@clever-component': resolve(__dirname, '../packages'),
      '@clever-component/components': resolve(
        __dirname,
        '../packages/components'
      ),
      '@clever-component/clever-popup': resolve(
        __dirname,
        '../packages/components/clever-popup'
      ),
      '@clever-component/clever-table': resolve(
        __dirname,
        '../packages/components/clever-table'
      )
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
