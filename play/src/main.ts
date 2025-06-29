import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import naive from 'naive-ui'
import '@clever-component'

// 配置代码高亮（可选）
// import hljs from 'highlight.js/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// import typescript from 'highlight.js/lib/languages/typescript'
// hljs.registerLanguage('javascript', javascript)
// hljs.registerLanguage('typescript', typescript)

// 导入 mock 服务（仅在开发环境）
if (import.meta.env.DEV) {
  import('./mock')
}

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')