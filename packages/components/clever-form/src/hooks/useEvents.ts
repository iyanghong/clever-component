/**
 * useEvents 组合式函数
 * @description 事件总线管理逻辑的组合式API
 */

import { ref, reactive, onUnmounted } from 'vue'
import type { UseEventsOptions, UseEventsReturn } from './types'
import type {
  EventBus,
  EventHandler
} from '../types'
import { events as eventUtils } from '../utils'

/**
 * 事件组合式函数
 * @param options 配置选项
 * @returns 事件状态和方法
 */
export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const {
    eventBus: externalEventBus,
    autoCleanup = true
  } = options

  // 响应式状态
  const eventBus = ref<EventBus>(externalEventBus || eventUtils.createEventBus())
  const listeners = ref<Map<string, EventHandler[]>>(new Map())

  // 内部状态
  const destroyed = ref<boolean>(false)
  const registeredHandlers = new Map<string, Set<EventHandler>>()

  /**
   * 监听事件
   * @param event 事件名称
   * @param handler 事件处理器
   */
  const on = (event: string, handler: EventHandler): void => {
    if (destroyed.value) {
      console.warn('事件总线已销毁，无法添加监听器')
      return
    }

    // 添加到事件总线
    eventBus.value.on(event, handler)

    // 记录监听器
    if (!listeners.value.has(event)) {
      listeners.value.set(event, [])
    }
    listeners.value.get(event)!.push(handler)

    // 记录已注册的处理器（用于自动清理）
    if (autoCleanup) {
      if (!registeredHandlers.has(event)) {
        registeredHandlers.set(event, new Set())
      }
      registeredHandlers.get(event)!.add(handler)
    }
  }

  /**
   * 移除事件监听
   * @param event 事件名称
   * @param handler 事件处理器，不传则移除该事件的所有监听器
   */
  const off = (event: string, handler?: EventHandler): void => {
    if (destroyed.value) {
      return
    }

    if (handler) {
      // 移除特定处理器
      eventBus.value.off(event, handler)
      
      // 更新监听器记录
      const eventListeners = listeners.value.get(event)
      if (eventListeners) {
        const index = eventListeners.indexOf(handler)
        if (index > -1) {
          eventListeners.splice(index, 1)
        }
        
        // 如果没有监听器了，删除事件记录
        if (eventListeners.length === 0) {
          listeners.value.delete(event)
        }
      }

      // 更新已注册处理器记录
      const registeredSet = registeredHandlers.get(event)
      if (registeredSet) {
        registeredSet.delete(handler)
        if (registeredSet.size === 0) {
          registeredHandlers.delete(event)
        }
      }
    } else {
      // 移除该事件的所有监听器
      const eventListeners = listeners.value.get(event)
      if (eventListeners) {
        eventListeners.forEach(h => {
          eventBus.value.off(event, h)
        })
        listeners.value.delete(event)
        registeredHandlers.delete(event)
      }
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  const emit = (event: string, ...args: any[]): void => {
    if (destroyed.value) {
      console.warn('事件总线已销毁，无法触发事件')
      return
    }

    try {
      eventBus.value.emit(event, ...args)
    } catch (err) {
      console.error(`触发事件 ${event} 时发生错误:`, err)
    }
  }

  /**
   * 监听事件一次
   * @param event 事件名称
   * @param handler 事件处理器
   */
  const once = (event: string, handler: EventHandler): void => {
    if (destroyed.value) {
      console.warn('事件总线已销毁，无法添加一次性监听器')
      return
    }

    // 创建包装处理器
    const wrappedHandler = (...args: any[]) => {
      try {
        handler(...args)
      } finally {
        // 自动移除监听器
        off(event, wrappedHandler)
      }
    }

    // 添加监听器
    on(event, wrappedHandler)
  }

  /**
   * 清除所有监听器
   */
  const clear = (): void => {
    if (destroyed.value) {
      return
    }

    // 移除所有已注册的监听器
    for (const [event, handlers] of registeredHandlers) {
      handlers.forEach(handler => {
        eventBus.value.off(event, handler)
      })
    }

    // 清空记录
    listeners.value.clear()
    registeredHandlers.clear()
  }

  /**
   * 获取事件监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  const getListenerCount = (event?: string): number => {
    if (event) {
      return listeners.value.get(event)?.length || 0
    }
    
    let total = 0
    for (const handlers of listeners.value.values()) {
      total += handlers.length
    }
    return total
  }

  /**
   * 获取所有事件名称
   * @returns 事件名称数组
   */
  const getEventNames = (): string[] => {
    return Array.from(listeners.value.keys())
  }

  /**
   * 检查是否有监听器
   * @param event 事件名称
   * @returns 是否有监听器
   */
  const hasListeners = (event: string): boolean => {
    return listeners.value.has(event) && listeners.value.get(event)!.length > 0
  }

  /**
   * 等待事件触发
   * @param event 事件名称
   * @param timeout 超时时间（毫秒）
   * @returns Promise
   */
  const waitFor = (event: string, timeout?: number): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | null = null
      
      // 设置超时
      if (timeout) {
        timeoutId = setTimeout(() => {
          off(event, handler)
          reject(new Error(`等待事件 ${event} 超时`))
        }, timeout)
      }

      // 事件处理器
      const handler = (...args: any[]) => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        off(event, handler)
        resolve(args)
      }

      // 添加一次性监听器
      once(event, handler)
    })
  }

  /**
   * 创建事件命名空间
   * @param namespace 命名空间
   * @returns 命名空间事件方法
   */
  const createNamespace = (namespace: string) => {
    const prefixEvent = (event: string) => `${namespace}:${event}`

    return {
      on: (event: string, handler: EventHandler) => on(prefixEvent(event), handler),
      off: (event: string, handler?: EventHandler) => off(prefixEvent(event), handler),
      emit: (event: string, ...args: any[]) => emit(prefixEvent(event), ...args),
      once: (event: string, handler: EventHandler) => once(prefixEvent(event), handler),
      waitFor: (event: string, timeout?: number) => waitFor(prefixEvent(event), timeout)
    }
  }

  // 自动清理
  if (autoCleanup) {
    onUnmounted(() => {
      destroyed.value = true
      clear()
    })
  }

  return {
    eventBus,
    listeners,
    on,
    off,
    emit,
    once,
    clear,
    // 扩展方法
    getListenerCount,
    getEventNames,
    hasListeners,
    waitFor,
    createNamespace
  } as UseEventsReturn & {
    getListenerCount: (event?: string) => number
    getEventNames: () => string[]
    hasListeners: (event: string) => boolean
    waitFor: (event: string, timeout?: number) => Promise<any[]>
    createNamespace: (namespace: string) => any
  }
}