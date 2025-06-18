/**
 * 判断是否为空值
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 判断是否为函数
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}

/**
 * 判断是否为对象
 */
export const isObject = (value: unknown): value is Record<string, any> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 判断是否为字符串
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

/**
 * 判断是否为数字
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * 判断是否为布尔值
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

/**
 * 深度克隆
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  return obj
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func(...args)
      }, wait)
    }
  }
}

/**
 * 生成唯一ID
 */
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 首字母大写
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转短横线
 */
export const kebabCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

/**
 * 短横线转驼峰
 */
export const camelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}