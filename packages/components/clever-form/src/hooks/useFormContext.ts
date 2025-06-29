/**
 * useFormContext 组合式函数
 * @description 表单上下文管理逻辑的组合式API
 */

import { ref, computed, inject, provide, onUnmounted } from 'vue'
import type { UseFormContextOptions, UseFormContextReturn } from './types'
import type {
  FormContext,
  FormEngine,
  FormConfig,
  FormData,
  FormState
} from '../types'
import { object } from '../utils'

// 上下文注入键
export const FORM_CONTEXT_KEY = Symbol('form-context')
export const PARENT_FORM_CONTEXT_KEY = Symbol('parent-form-context')

/**
 * 表单上下文组合式函数
 * @param options 配置选项
 * @returns 上下文状态和方法
 */
export function useFormContext(options: UseFormContextOptions = {}): UseFormContextReturn {
  const {
    context: initialContext,
    inherit = true
  } = options

  // 获取父级上下文
  const parentContext = ref<FormContext | null>(
    inherit ? inject(FORM_CONTEXT_KEY, null) : null
  )

  // 创建当前上下文
  const formContext = ref<FormContext>(createFormContext(initialContext))

  // 内部状态
  const destroyed = ref<boolean>(false)
  const subscribers = new Set<(context: FormContext) => void>()

  /**
   * 创建表单上下文
   * @param initial 初始上下文
   * @returns 表单上下文
   */
  function createFormContext(initial?: FormContext): FormContext {
    const baseContext: FormContext = {
      id: 'context_' + Date.now(),
      formEngine: null,
      formConfig: null,
      formData: {},
      formState: {
        status: 'idle',
        mode: 'create',
        data: {},
        errors: {},
        touched: {},
        dirty: false,
        valid: true,
        submitting: false,
        loading: false
      },
      validationEngine: null,
      eventBus: null,
      parent: parentContext.value,
      children: new Set(),
      metadata: {},
      permissions: {
        read: true,
        write: true,
        delete: false
      }
    }

    // 合并初始上下文
    if (initial) {
      Object.assign(baseContext, initial)
    }

    // 如果有父级上下文，建立父子关系
    if (parentContext.value) {
      baseContext.parent = parentContext.value
      parentContext.value.children.add(baseContext)
    }

    return baseContext
  }

  /**
   * 设置表单上下文
   * @param context 新的上下文
   */
  const setContext = (context: FormContext): void => {
    if (destroyed.value) {
      return
    }

    // 清理旧的父子关系
    if (formContext.value.parent) {
      formContext.value.parent.children.delete(formContext.value)
    }

    // 建立新的上下文
    formContext.value = {
      ...context,
      parent: parentContext.value,
      children: formContext.value.children // 保持现有子级
    }

    // 建立新的父子关系
    if (parentContext.value) {
      parentContext.value.children.add(formContext.value)
    }

    // 通知订阅者
    notifySubscribers()
  }

  /**
   * 更新表单上下文
   * @param updates 更新内容
   */
  const updateContext = (updates: Partial<FormContext>): void => {
    if (destroyed.value) {
      return
    }

    // 深度合并更新
    const updatedContext = object.deepMerge(formContext.value, updates)
    formContext.value = updatedContext

    // 通知订阅者
    notifySubscribers()
  }

  /**
   * 获取表单上下文
   * @returns 当前上下文
   */
  const getContext = (): FormContext => {
    return formContext.value
  }

  /**
   * 清除表单上下文
   */
  const clearContext = (): void => {
    if (destroyed.value) {
      return
    }

    // 清理父子关系
    if (formContext.value.parent) {
      formContext.value.parent.children.delete(formContext.value)
    }

    // 清理子级关系
    formContext.value.children.clear()

    // 重置上下文
    formContext.value = createFormContext()

    // 通知订阅者
    notifySubscribers()
  }

  /**
   * 订阅上下文变化
   * @param callback 回调函数
   * @returns 取消订阅函数
   */
  const subscribe = (callback: (context: FormContext) => void): (() => void) => {
    subscribers.add(callback)
    
    // 立即调用一次
    callback(formContext.value)
    
    // 返回取消订阅函数
    return () => {
      subscribers.delete(callback)
    }
  }

  /**
   * 通知所有订阅者
   */
  const notifySubscribers = (): void => {
    subscribers.forEach(callback => {
      try {
        callback(formContext.value)
      } catch (err) {
        console.error('上下文订阅者回调执行失败:', err)
      }
    })
  }

  /**
   * 获取根上下文
   * @returns 根上下文
   */
  const getRootContext = (): FormContext => {
    let current = formContext.value
    while (current.parent) {
      current = current.parent
    }
    return current
  }

  /**
   * 获取上下文路径
   * @returns 上下文路径数组
   */
  const getContextPath = (): FormContext[] => {
    const path: FormContext[] = []
    let current: FormContext | null = formContext.value
    
    while (current) {
      path.unshift(current)
      current = current.parent
    }
    
    return path
  }

  /**
   * 查找子上下文
   * @param predicate 查找条件
   * @returns 匹配的子上下文
   */
  const findChildContext = (predicate: (context: FormContext) => boolean): FormContext | null => {
    for (const child of formContext.value.children) {
      if (predicate(child)) {
        return child
      }
      
      // 递归查找
      const found = findChildContextRecursive(child, predicate)
      if (found) {
        return found
      }
    }
    
    return null
  }

  /**
   * 递归查找子上下文
   * @param context 当前上下文
   * @param predicate 查找条件
   * @returns 匹配的上下文
   */
  const findChildContextRecursive = (context: FormContext, predicate: (context: FormContext) => boolean): FormContext | null => {
    for (const child of context.children) {
      if (predicate(child)) {
        return child
      }
      
      const found = findChildContextRecursive(child, predicate)
      if (found) {
        return found
      }
    }
    
    return null
  }

  /**
   * 检查权限
   * @param permission 权限类型
   * @returns 是否有权限
   */
  const hasPermission = (permission: keyof FormContext['permissions']): boolean => {
    return formContext.value.permissions[permission] || false
  }

  /**
   * 设置权限
   * @param permissions 权限配置
   */
  const setPermissions = (permissions: Partial<FormContext['permissions']>): void => {
    formContext.value.permissions = {
      ...formContext.value.permissions,
      ...permissions
    }
    notifySubscribers()
  }

  /**
   * 获取元数据
   * @param key 元数据键
   * @returns 元数据值
   */
  const getMetadata = (key: string): any => {
    return formContext.value.metadata[key]
  }

  /**
   * 设置元数据
   * @param key 元数据键
   * @param value 元数据值
   */
  const setMetadata = (key: string, value: any): void => {
    formContext.value.metadata[key] = value
    notifySubscribers()
  }

  // 提供上下文给子组件
  provide(FORM_CONTEXT_KEY, formContext)
  
  // 如果有父级上下文，也提供父级上下文引用
  if (parentContext.value) {
    provide(PARENT_FORM_CONTEXT_KEY, parentContext)
  }

  // 清理资源
  onUnmounted(() => {
    destroyed.value = true
    
    // 清理父子关系
    if (formContext.value.parent) {
      formContext.value.parent.children.delete(formContext.value)
    }
    
    // 清理子级关系
    formContext.value.children.clear()
    
    // 清理订阅者
    subscribers.clear()
  })

  return {
    formContext,
    parentContext,
    setContext,
    updateContext,
    getContext,
    clearContext,
    // 扩展方法
    subscribe,
    getRootContext,
    getContextPath,
    findChildContext,
    hasPermission,
    setPermissions,
    getMetadata,
    setMetadata
  } as UseFormContextReturn & {
    subscribe: (callback: (context: FormContext) => void) => (() => void)
    getRootContext: () => FormContext
    getContextPath: () => FormContext[]
    findChildContext: (predicate: (context: FormContext) => boolean) => FormContext | null
    hasPermission: (permission: keyof FormContext['permissions']) => boolean
    setPermissions: (permissions: Partial<FormContext['permissions']>) => void
    getMetadata: (key: string) => any
    setMetadata: (key: string, value: any) => void
  }
}

/**
 * 注入表单上下文
 * @returns 表单上下文
 */
export function injectFormContext(): FormContext | null {
  return inject(FORM_CONTEXT_KEY, null)
}

/**
 * 注入父级表单上下文
 * @returns 父级表单上下文
 */
export function injectParentFormContext(): FormContext | null {
  return inject(PARENT_FORM_CONTEXT_KEY, null)
}