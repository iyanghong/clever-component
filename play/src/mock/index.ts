// Mock 模块入口文件
export { mockApi, callMockApi, delay } from './api'
export {
  installMockInterceptor,
  uninstallMockInterceptor,
  enableMockInterceptor,
  disableMockInterceptor
} from './interceptor'

// 自动初始化 mock 服务（拦截器已在 interceptor.ts 中自动安装）
if (import.meta.env.DEV) {
  console.log('[Mock Service] Mock API service is ready!')
}