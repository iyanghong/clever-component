import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      tsConfigFilePath: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages'),
      '@clever-component': resolve(__dirname, 'packages')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'CleverComponent',
      fileName: (format) => `index.${format === 'es' ? 'js' : format}`
    },
    rollupOptions: {
      external: ['vue', 'naive-ui', 'lodash-es'],
      output: {
        globals: {
          vue: 'Vue',
          'naive-ui': 'NaiveUI',
          'lodash-es': 'lodashEs'
        }
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  test: {
    environment: 'jsdom'
  }
})