import { createApp } from 'vue'
import App from './App.vue'

// 导入 Naive UI
import naive from 'naive-ui'

// 导入组件库
import CleverComponent from '@clever-component'

const app = createApp(App)

// 使用 Naive UI
app.use(naive)

// 使用组件库
app.use(CleverComponent)

app.mount('#app')