// HTTP 拦截器，用于拦截 API 请求并返回模拟数据
import { callMockApi } from './api'

// 存储原始的 fetch 函数
const originalFetch = window.fetch

// 拦截器状态
let isInterceptorEnabled = true

// 启用/禁用拦截器
export const enableMockInterceptor = () => {
  isInterceptorEnabled = true
}

export const disableMockInterceptor = () => {
  isInterceptorEnabled = false
}

// 解析 URL 参数
const parseUrlParams = (url: string) => {
  const urlObj = new URL(url, window.location.origin)
  const params: Record<string, any> = {}
  
  urlObj.searchParams.forEach((value, key) => {
    // 尝试解析数字
    if (!isNaN(Number(value))) {
      params[key] = Number(value)
    } else if (value === 'true' || value === 'false') {
      params[key] = value === 'true'
    } else {
      params[key] = value
    }
  })
  
  return {
    pathname: urlObj.pathname,
    params
  }
}

// 模拟 fetch 函数
const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString()
  const method = init?.method || 'GET'
  
  // 检查是否是需要拦截的 API
  if (url.includes('/api/')) {
    try {
      const { pathname, params } = parseUrlParams(url)
      
      let requestData = null
      if (init?.body) {
        try {
          requestData = JSON.parse(init.body as string)
        } catch {
          requestData = init.body
        }
      }
      
      console.log(`[Mock API] ${method} ${pathname}`, { params, data: requestData })
      
      const result = await callMockApi(pathname, method, params, requestData)
      
      // 创建模拟的 Response 对象
      const response = new Response(JSON.stringify(result), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log(`[Mock API] Response:`, result)
      return response
    } catch (error) {
      console.error(`[Mock API] Error:`, error)
      
      // 返回错误响应
      const errorResponse = {
        code: 500,
        message: error.message || 'Internal Server Error',
        data: null
      }
      
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
  
  // 对于非 API 请求，使用原始 fetch
  return originalFetch(input, init)
}

// 安装拦截器
export const installMockInterceptor = () => {
  if (typeof window !== 'undefined') {
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (isInterceptorEnabled) {
        return mockFetch(input, init)
      }
      return originalFetch(input, init)
    }
    
    console.log('[Mock Interceptor] Installed successfully')
  }
}

// 卸载拦截器
export const uninstallMockInterceptor = () => {
  if (typeof window !== 'undefined') {
    window.fetch = originalFetch
    console.log('[Mock Interceptor] Uninstalled')
  }
}

// 自动安装拦截器（仅在开发环境）
if (import.meta.env.DEV) {
  installMockInterceptor()
}