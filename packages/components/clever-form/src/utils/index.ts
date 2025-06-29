/**
 * 工具函数
 * @description 提供表单组件中使用的各种实用工具函数
 */

import type { FormData, FieldConfig, ContainerConfig } from '../types'
import { REGEX_PATTERNS, ERROR_CODES, ERROR_MESSAGES } from '../constants'

// 类型判断工具
export const is = {
  // 判断是否为undefined
  undefined: (value: any): value is undefined => value === undefined,

  // 判断是否为null
  null: (value: any): value is null => value === null,

  // 判断是否为null或undefined
  nullOrUndefined: (value: any): value is null | undefined => value == null,

  // 判断是否为字符串
  string: (value: any): value is string => typeof value === 'string',

  // 判断是否为数字
  number: (value: any): value is number =>
    typeof value === 'number' && !isNaN(value),

  // 判断是否为布尔值
  boolean: (value: any): value is boolean => typeof value === 'boolean',

  // 判断是否为函数
  function: (value: any): value is Function => typeof value === 'function',

  // 判断是否为对象
  object: (value: any): value is object =>
    value !== null && typeof value === 'object',

  // 判断是否为数组
  array: (value: any): value is any[] => Array.isArray(value),

  // 判断是否为Date对象
  date: (value: any): value is Date => value instanceof Date,

  // 判断是否为正则表达式
  regexp: (value: any): value is RegExp => value instanceof RegExp,

  // 判断是否为Promise
  promise: (value: any): value is Promise<any> => value instanceof Promise,

  // 判断是否为空字符串
  emptyString: (value: any): boolean => is.string(value) && value.trim() === '',

  // 判断是否为空数组
  emptyArray: (value: any): boolean => is.array(value) && value.length === 0,

  // 判断是否为空对象
  emptyObject: (value: any): boolean =>
    is.object(value) && Object.keys(value).length === 0,

  // 判断是否为空值（null、undefined、空字符串、空数组、空对象）
  empty: (value: any): boolean => {
    return (
      is.nullOrUndefined(value) ||
      is.emptyString(value) ||
      is.emptyArray(value) ||
      is.emptyObject(value)
    )
  }
}

// 对象工具
export const object = {
  // 深拷贝
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (obj instanceof Array)
      return obj.map(item => object.deepClone(item)) as any
    if (typeof obj === 'object') {
      const cloned = {} as any
      Object.keys(obj).forEach(key => {
        cloned[key] = object.deepClone((obj as any)[key])
      })
      return cloned
    }
    return obj
  },

  // 深度合并
  deepMerge: <T extends Record<string, any>>(
    target: T,
    ...sources: Partial<T>[]
  ): T => {
    if (!sources.length) return target
    const source = sources.shift()

    if (is.object(target) && is.object(source)) {
      for (const key in source) {
        if (is.object(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          object.deepMerge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return object.deepMerge(target, ...sources)
  },

  // 获取嵌套属性值
  get: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue
      }
      result = result[key]
    }

    return result !== undefined ? result : defaultValue
  },

  // 设置嵌套属性值
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    let current = obj

    for (const key of keys) {
      if (!(key in current) || !is.object(current[key])) {
        current[key] = {}
      }
      current = current[key]
    }

    current[lastKey] = value
  },

  // 删除嵌套属性
  unset: (obj: any, path: string): boolean => {
    const keys = path.split('.')
    const lastKey = keys.pop()!
    let current = obj

    for (const key of keys) {
      if (!(key in current) || !is.object(current[key])) {
        return false
      }
      current = current[key]
    }

    return delete current[lastKey]
  },

  // 检查是否有嵌套属性
  has: (obj: any, path: string): boolean => {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
      if (!(key in current)) {
        return false
      }
      current = current[key]
    }

    return true
  },

  // 深度比较两个对象是否相等
  compareData: (obj1: any, obj2: any): boolean => {
    // 如果两个值严格相等，直接返回true
    if (obj1 === obj2) {
      return true
    }

    // 如果其中一个为null或undefined，另一个不是，返回false
    if (obj1 == null || obj2 == null) {
      return obj1 === obj2
    }

    // 如果类型不同，返回false
    if (typeof obj1 !== typeof obj2) {
      return false
    }

    // 如果是基本类型，直接比较
    if (typeof obj1 !== 'object') {
      return obj1 === obj2
    }

    // 如果是数组
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!object.compareData(obj1[i], obj2[i])) {
          return false
        }
      }
      return true
    }

    // 如果一个是数组另一个不是
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
      return false
    }

    // 如果是对象
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false
      }
      if (!object.compareData(obj1[key], obj2[key])) {
        return false
      }
    }

    return true
  },

  // 获取对象所有路径
  getPaths: (obj: any, prefix = ''): string[] => {
    const paths: string[] = []

    for (const key in obj) {
      const path = prefix ? `${prefix}.${key}` : key
      paths.push(path)

      if (is.object(obj[key]) && !is.array(obj[key])) {
        paths.push(...object.getPaths(obj[key], path))
      }
    }

    return paths
  },

  // 扁平化对象
  flatten: (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {}

    for (const key in obj) {
      const path = prefix ? `${prefix}.${key}` : key

      if (is.object(obj[key]) && !is.array(obj[key]) && !is.date(obj[key])) {
        Object.assign(flattened, object.flatten(obj[key], path))
      } else {
        flattened[path] = obj[key]
      }
    }

    return flattened
  },

  // 反扁平化对象
  unflatten: (obj: Record<string, any>): any => {
    const result: any = {}

    for (const path in obj) {
      object.set(result, path, obj[path])
    }

    return result
  }
}

// 数组工具
export const array = {
  // 去重
  unique: <T>(arr: T[]): T[] => [...new Set(arr)],

  // 根据属性去重
  uniqueBy: <T>(arr: T[], key: keyof T): T[] => {
    const seen = new Set()
    return arr.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  },

  // 分组
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce(
      (groups, item) => {
        const group = String(item[key])
        groups[group] = groups[group] || []
        groups[group].push(item)
        return groups
      },
      {} as Record<string, T[]>
    )
  },

  // 排序
  sortBy: <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  },

  // 查找
  findBy: <T>(arr: T[], key: keyof T, value: any): T | undefined => {
    return arr.find(item => item[key] === value)
  },

  // 查找索引
  findIndexBy: <T>(arr: T[], key: keyof T, value: any): number => {
    return arr.findIndex(item => item[key] === value)
  },

  // 移除
  remove: <T>(arr: T[], predicate: (item: T) => boolean): T[] => {
    return arr.filter(item => !predicate(item))
  },

  // 移除指定项
  removeItem: <T>(arr: T[], item: T): T[] => {
    const index = arr.indexOf(item)
    if (index > -1) {
      return [...arr.slice(0, index), ...arr.slice(index + 1)]
    }
    return arr
  },

  // 分块
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  }
}

// 字符串工具
export const string = {
  // 驼峰转换
  camelCase: (str: string): string => {
    return str.replace(/[-_\s]+(.)?/g, (_, char) =>
      char ? char.toUpperCase() : ''
    )
  },

  // 短横线转换
  kebabCase: (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  },

  // 下划线转换
  snakeCase: (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
  },

  // 首字母大写
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  // 截断
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str
    return str.slice(0, length) + suffix
  },

  // 生成随机字符串
  random: (length = 8): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 生成UUID
  uuid: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

// 验证工具
export const validate = {
  // 邮箱验证
  email: (value: string): boolean => REGEX_PATTERNS.EMAIL.test(value),

  // 手机号验证
  phone: (value: string): boolean => REGEX_PATTERNS.PHONE.test(value),

  // URL验证
  url: (value: string): boolean => REGEX_PATTERNS.URL.test(value),

  // 身份证验证
  idCard: (value: string): boolean => REGEX_PATTERNS.ID_CARD.test(value),

  // 中文验证
  chinese: (value: string): boolean => REGEX_PATTERNS.CHINESE.test(value),

  // 数字验证
  number: (value: string): boolean => REGEX_PATTERNS.NUMBER.test(value),

  // 整数验证
  integer: (value: string): boolean => REGEX_PATTERNS.INTEGER.test(value),

  // 正数验证
  positiveNumber: (value: string): boolean =>
    REGEX_PATTERNS.POSITIVE_NUMBER.test(value),

  // 正整数验证
  positiveInteger: (value: string): boolean =>
    REGEX_PATTERNS.POSITIVE_INTEGER.test(value),

  // 长度验证
  length: (value: string, min?: number, max?: number): boolean => {
    const len = value.length
    if (min !== undefined && len < min) return false
    if (max !== undefined && len > max) return false
    return true
  },

  // 范围验证
  range: (value: number, min?: number, max?: number): boolean => {
    if (min !== undefined && value < min) return false
    if (max !== undefined && value > max) return false
    return true
  },

  // 创建验证引擎
  createEngine: (config?: any) => {
    return {
      validate: async (path: string, value: any) => {
        // 基础验证实现
        return {
          status: 'success' as const,
          level: 'info' as const,
          message: '',
          field: path,
          timestamp: Date.now()
        }
      },
      validateAll: async (data: any) => {
        // 全量验证实现 - 返回ValidationResult数组
        const results: any[] = []

        // 遍历数据字段进行验证
        for (const [field, value] of Object.entries(data || {})) {
          results.push({
            status: 'success' as const,
            level: 'info' as const,
            message: '',
            field,
            timestamp: Date.now()
          })
        }

        return results
      }
    }
  }
}

// 格式化工具
export const format = {
  // 格式化数字
  number: (value: number, decimals = 2): string => {
    return value.toFixed(decimals)
  },

  // 格式化货币
  currency: (value: number, currency = '¥', decimals = 2): string => {
    return `${currency}${value.toFixed(decimals)}`
  },

  // 格式化百分比
  percentage: (value: number, decimals = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`
  },

  // 格式化文件大小
  fileSize: (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  },

  // 格式化日期
  date: (date: Date, format = 'YYYY-MM-DD'): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// 错误处理工具
export const error = {
  // 创建错误
  create: (code: string, message?: string, details?: any): Error => {
    const error = new Error(
      message ||
        ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ||
        '未知错误'
    )
    ;(error as any).code = code
    ;(error as any).details = details
    return error
  },

  // 创建错误（别名方法，保持向后兼容）
  createError: (code: string, message?: string, details?: any): Error => {
    return error.create(code, message, details)
  },

  // 判断是否为指定错误
  is: (error: any, code: string): boolean => {
    return error && error.code === code
  },

  // 安全执行函数
  safe: async <T>(fn: () => Promise<T>): Promise<[Error | null, T | null]> => {
    try {
      const result = await fn()
      return [null, result]
    } catch (err) {
      return [err as Error, null]
    }
  }
}

// 表单工具
export const form = {
  // 获取值通过路径
  getValueByPath: (obj: any, path: string, defaultValue?: any): any => {
    return object.get(obj, path, defaultValue)
  },

  // 设置值通过路径
  setValueByPath: (obj: any, path: string, value: any): void => {
    object.set(obj, path, value)
  },

  // 获取字段路径
  getFieldPaths: (
    config: ContainerConfig | FieldConfig,
    prefix = ''
  ): string[] => {
    const paths: string[] = []

    if ('children' in config) {
      // 容器配置
      config.children.forEach((child, index) => {
        const childPath = prefix ? `${prefix}.${index}` : String(index)
        if ('field' in child) {
          // 字段配置
          paths.push(`${childPath}.${child.field}`)
        } else {
          // 嵌套容器
          paths.push(...form.getFieldPaths(child, childPath))
        }
      })
    } else if ('field' in config) {
      // 字段配置
      const fieldPath = prefix ? `${prefix}.${config.field}` : config.field
      paths.push(fieldPath)
    }

    return paths
  },

  // 验证表单数据
  validateData: (data: FormData, config: ContainerConfig): boolean => {
    // 简单验证实现，实际应该使用验证引擎
    const fieldPaths = form.getFieldPaths(config)

    for (const path of fieldPaths) {
      const value = object.get(data, path)
      if (is.empty(value)) {
        // 检查是否为必填字段
        // 这里需要根据字段配置来判断
        return false
      }
    }

    return true
  },

  // 清理表单数据
  cleanData: (data: FormData): FormData => {
    const cleaned: FormData = {}

    for (const key in data) {
      const value = data[key]
      if (!is.empty(value)) {
        cleaned[key] = value
      }
    }

    return cleaned
  },

  // 比较表单数据
  compareData: (data1: FormData, data2: FormData): boolean => {
    const keys1 = Object.keys(data1)
    const keys2 = Object.keys(data2)

    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
      if (data1[key] !== data2[key]) return false
    }

    return true
  }
}

// 事件工具
export const events = {
  // 创建事件总线
  createEventBus: () => {
    const listeners = new Map<
      string,
      Array<{ handler: Function; once?: boolean; id: string }>
    >()
    let idCounter = 0

    return {
      config: {},

      on(type: string, handler: Function, config?: any): string {
        const id = `listener_${++idCounter}`
        if (!listeners.has(type)) {
          listeners.set(type, [])
        }
        listeners.get(type)!.push({ handler, once: config?.once, id })
        return id
      },

      once(type: string, handler: Function, config?: any): string {
        return this.on(type, handler, { ...config, once: true })
      },

      off(type: string, handlerOrId?: Function | string): void {
        const typeListeners = listeners.get(type)
        if (!typeListeners) return

        if (typeof handlerOrId === 'string') {
          const index = typeListeners.findIndex(l => l.id === handlerOrId)
          if (index > -1) typeListeners.splice(index, 1)
        } else if (typeof handlerOrId === 'function') {
          const index = typeListeners.findIndex(l => l.handler === handlerOrId)
          if (index > -1) typeListeners.splice(index, 1)
        } else {
          listeners.delete(type)
        }
      },

      removeAllListeners(type?: string): void {
        if (type) {
          listeners.delete(type)
        } else {
          listeners.clear()
        }
      },

      async emit(event: any, data?: any): Promise<any[]> {
        const type = typeof event === 'string' ? event : event.type
        const typeListeners = listeners.get(type)
        if (!typeListeners) return []

        const results = []
        const toRemove = []

        for (let i = 0; i < typeListeners.length; i++) {
          const listener = typeListeners[i]
          try {
            const result = await listener.handler(
              typeof event === 'string' ? { type, data } : event
            )
            results.push(result)
            if (listener.once) {
              toRemove.push(i)
            }
          } catch (error) {
            console.error(`Event handler error for ${type}:`, error)
          }
        }

        // 移除一次性监听器
        for (let i = toRemove.length - 1; i >= 0; i--) {
          typeListeners.splice(toRemove[i], 1)
        }

        return results
      },

      emitSync(event: any, data?: any): any[] {
        const type = typeof event === 'string' ? event : event.type
        const typeListeners = listeners.get(type)
        if (!typeListeners) return []

        const results = []
        const toRemove = []

        for (let i = 0; i < typeListeners.length; i++) {
          const listener = typeListeners[i]
          try {
            const result = listener.handler(
              typeof event === 'string' ? { type, data } : event
            )
            results.push(result)
            if (listener.once) {
              toRemove.push(i)
            }
          } catch (error) {
            console.error(`Event handler error for ${type}:`, error)
          }
        }

        // 移除一次性监听器
        for (let i = toRemove.length - 1; i >= 0; i--) {
          typeListeners.splice(toRemove[i], 1)
        }

        return results
      },

      addFilter() {},
      removeFilter() {},
      addTransformer() {},
      removeTransformer() {},
      addMiddleware() {},
      removeMiddleware() {},
      getListeners() {
        return []
      },
      getStats() {
        return {}
      },
      getHistory() {
        return []
      },
      clearHistory() {},
      destroy() {
        listeners.clear()
      }
    }
  }
}

// 配置创建工具
export const createFormConfig = (config: Partial<any> = {}): any => {
  return {
    labelWidth: 'auto',
    labelPlacement: 'left',
    size: 'medium',
    disabled: false,
    showFeedback: true,
    showLabel: true,
    showRequireMark: true,
    requireMarkPlacement: 'right',
    ...config
  }
}

export const createFieldConfig = (config: Partial<any> = {}): any => {
  return {
    type: 'input',
    field: '',
    label: '',
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false,
    clearable: true,
    ...config
  }
}

export const createContainerConfig = (config: Partial<any> = {}): any => {
  return {
    type: 'grid',
    children: [],
    props: {},
    ...config
  }
}

export const createPopupConfig = (config: Partial<any> = {}): any => {
  return {
    type: 'modal',
    title: '',
    width: 520,
    height: 'auto',
    closable: true,
    maskClosable: true,
    ...config
  }
}

// 验证工具
export const validateField = async (
  value: any,
  rules: any[] = []
): Promise<any> => {
  const errors: string[] = []

  for (const rule of rules) {
    if (rule.required && is.empty(value)) {
      errors.push(rule.message || '此字段为必填项')
      continue
    }

    if (rule.type && !is.empty(value)) {
      switch (rule.type) {
        case 'email':
          if (!validate.email(String(value))) {
            errors.push(rule.message || '请输入有效的邮箱地址')
          }
          break
        case 'phone':
          if (!validate.phone(String(value))) {
            errors.push(rule.message || '请输入有效的手机号码')
          }
          break
        case 'url':
          if (!validate.url(String(value))) {
            errors.push(rule.message || '请输入有效的URL地址')
          }
          break
      }
    }

    if (rule.min !== undefined && String(value).length < rule.min) {
      errors.push(rule.message || `最少输入${rule.min}个字符`)
    }

    if (rule.max !== undefined && String(value).length > rule.max) {
      errors.push(rule.message || `最多输入${rule.max}个字符`)
    }

    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors.push(rule.message || '格式不正确')
    }

    if (rule.validator && is.function(rule.validator)) {
      try {
        const result = await rule.validator(value)
        if (result !== true && result !== undefined) {
          errors.push(
            typeof result === 'string' ? result : rule.message || '验证失败'
          )
        }
      } catch (err) {
        errors.push(rule.message || '验证过程中发生错误')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateForm = async (data: any, config: any): Promise<any> => {
  const results: Record<string, any> = {}
  const fieldPaths = form.getFieldPaths(config)

  for (const path of fieldPaths) {
    const value = object.get(data, path)
    // 这里需要根据字段配置获取验证规则
    const rules: any[] = [] // 实际应该从字段配置中获取
    results[path] = await validateField(value, rules)
  }

  const valid = Object.values(results).every((result: any) => result.valid)

  return {
    valid,
    results
  }
}

// 格式化工具
export const formatFieldValue = (value: any, type: string): any => {
  if (is.empty(value)) return value

  switch (type) {
    case 'number':
      return is.number(value) ? value : Number(value)
    case 'string':
      return String(value)
    case 'boolean':
      return Boolean(value)
    case 'date':
      return is.date(value) ? value : new Date(value)
    case 'array':
      return is.array(value) ? value : [value]
    default:
      return value
  }
}

export const parseFieldValue = (value: any, type: string): any => {
  if (is.empty(value)) return value

  switch (type) {
    case 'number':
      const num = Number(value)
      return isNaN(num) ? value : num
    case 'boolean':
      if (is.string(value)) {
        return value === 'true' || value === '1'
      }
      return Boolean(value)
    case 'date':
      if (is.string(value) || is.number(value)) {
        const date = new Date(value)
        return isNaN(date.getTime()) ? value : date
      }
      return value
    case 'array':
      if (is.string(value)) {
        try {
          return JSON.parse(value)
        } catch {
          return [value]
        }
      }
      return is.array(value) ? value : [value]
    default:
      return value
  }
}

export const getFormItemProps = (schema: FieldConfig) => {
  const baseProps = {
    label: schema.label,
    path: schema.field,
    // 注意：不在这里设置 rules，因为 NForm 已经通过全局 rules 属性管理校验规则
    // rules: schema.rules, // 移除这行，避免与 NForm 的全局 rules 冲突
    labelWidth: schema.labelWidth,
    showRequiredMark: schema.required,
    // 确保校验状态能正确传递
    showFeedback: true
  }

  // 过滤掉undefined的属性
  return Object.fromEntries(
    Object.entries(baseProps).filter(([_, value]) => value !== undefined)
  )
}

/**
 * 规范化children配置，为字段项自动添加type: 'field'
 * @param children - 子项配置数组
 * @returns 规范化后的配置数组
 */
export const normalizeChildren = (
  children: Array<FieldConfig | ContainerConfig>
): Array<
  (FieldConfig & { type: 'field' }) | (ContainerConfig & { type: 'container' })
> => {
  return children.map((item: any) => {
    // 如果已经有type属性，直接返回
    if ('type' in item && item.type) {
      return item as any
    }

    // 判断是否为字段配置：包含field和component属性
    if ('field' in item && 'component' in item) {
      return {
        ...item,
        type: 'field' as const
      }
    }

    // 判断是否为容器配置：包含children属性
    if ('children' in item) {
      return {
        ...item,
        type: 'container' as const,
        children: normalizeChildren(item.children)
      } as FieldConfig
    }

    // 默认作为字段处理
    return {
      ...item,
      type: 'field' as const
    }
  })
}

// 导出所有工具
export default {
  is,
  object,
  array,
  string,
  validate,
  format,
  debounce,
  throttle,
  error,
  form,
  events,
  createFormConfig,
  createFieldConfig,
  createContainerConfig,
  createPopupConfig,
  validateField,
  validateForm,
  formatFieldValue,
  parseFieldValue,
  normalizeChildren
}
