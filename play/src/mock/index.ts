// Mock 模块入口文件
export { mockApi, callMockApi, delay } from './api'
export {
  installMockInterceptor,
  uninstallMockInterceptor,
  enableMockInterceptor,
  disableMockInterceptor
} from './interceptor'

// 自动初始化 mock 服务
if (import.meta.env.DEV) {
  console.log('[Mock Service] Initializing mock API service...')
  
  // 动态导入拦截器以避免在生产环境中加载
  import('./interceptor').then(({ installMockInterceptor }) => {
    installMockInterceptor()
    console.log('[Mock Service] Mock API service is ready!')
  })
}