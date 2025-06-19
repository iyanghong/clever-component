import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import naive from 'naive-ui'
import '@clever-component'

// 导入 mock 服务（仅在开发环境）
if (import.meta.env.DEV) {
  import('./mock')
}

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')