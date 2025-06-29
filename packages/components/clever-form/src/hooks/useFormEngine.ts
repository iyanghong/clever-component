/**
 * useFormEngine 组合式函数 - 重构版
 * @description 简化的表单引擎，移除复杂的事件系统和验证引擎
 */

import { ref, reactive, computed, onUnmounted } from 'vue'
import type {
  FormConfig,
  FormData,
  FormEngine,
  FormEngineState
} from '../types'
import utils from '../utils'
import { FORM_STATUS } from '../constants'

const { object } = utils

// 全局表单引擎实例存储
const engines = new Map<string, FormEngine>()

/**
 * 表单引擎组合式函数 - 重构版
 * @param id 表单引擎ID
 * @returns 表单引擎实例和管理方法
 */
export function useFormEngine(id?: string) {
  const engineId = id || `form-engine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // 引擎状态
  const engineState = ref<FormEngineState>({
    initialized: false,
    destroyed: false
  })
  
  const initialized = computed(() => engineState.value.initialized)
  const destroyed = computed(() => engineState.value.destroyed)

  /**
   * 创建表单引擎实例
   */
  const createFormEngine = (config: FormConfig): FormEngine => {
    const engine: FormEngine = {
      id: engineId,
      config,
      state: reactive({
        status: FORM_STATUS.IDLE,
        data: {},
        errors: {},
        loading: false,
        submitting: false
      }),

      // 数据操作方法
      getData: (path?: string) => {
        if (path) {
          return object.get(engine.state.data, path)
        }
        return engine.state.data
      },

      setData: (data: FormData) => {
        engine.state.data = object.deepClone(data)
      },

      updateData: (path: string, value: any) => {
        object.set(engine.state.data, path, value)
      },

      // 表单操作方法
      submit: async () => {
        try {
          engine.state.submitting = true
          engine.state.status = FORM_STATUS.SUBMITTING
          
          // 这里可以添加提交逻辑
          // 由于移除了事件系统，直接返回数据
          
          engine.state.status = FORM_STATUS.SUCCESS
          return engine.state.data
        } catch (error) {
          engine.state.status = FORM_STATUS.ERROR
          throw error
        } finally {
          engine.state.submitting = false
        }
      },

      reset: () => {
        // 重置到初始状态
        const defaultData = config.defaultData || {}
        engine.state.data = object.deepClone(defaultData)
        engine.state.errors = {}
        engine.state.status = FORM_STATUS.IDLE
      }
    }

    return engine
  }

  /**
   * 获取表单引擎实例
   */
  const getEngine = (): FormEngine | undefined => {
    return engines.get(engineId)
  }

  /**
   * 初始化表单引擎
   */
  const initialize = (config: FormConfig): FormEngine => {
    if (engineState.value.initialized) {
      throw new Error(`表单引擎 ${engineId} 已经初始化`)
    }

    if (engineState.value.destroyed) {
      throw new Error(`表单引擎 ${engineId} 已被销毁`)
    }

    try {
      // 创建引擎实例
      const engine = createFormEngine(config)
      
      // 存储引擎实例
      engines.set(engineId, engine)
      
      // 标记为已初始化
      engineState.value.initialized = true
      
      return engine
    } catch (error) {
      throw new Error(`初始化表单引擎失败: ${error}`)
    }
  }

  /**
   * 销毁表单引擎
   */
  const destroy = () => {
    if (engineState.value.destroyed) {
      return
    }

    // 从全局存储中移除
    engines.delete(engineId)
    
    // 标记为已销毁
    engineState.value.destroyed = true
    engineState.value.initialized = false
  }

  // 组件卸载时自动销毁
  onUnmounted(() => {
    destroy()
  })

  return {
    // 状态
    engineId,
    engineState,
    initialized,
    destroyed,

    // 方法
    initialize,
    getEngine,
    destroy,

    // 数据操作（代理到引擎实例）
    getData: (path?: string) => {
      const engine = getEngine()
      return engine?.getData(path)
    },
    
    setData: (data: FormData) => {
      const engine = getEngine()
      engine?.setData(data)
    },
    
    updateData: (path: string, value: any) => {
      const engine = getEngine()
      engine?.updateData(path, value)
    },
    
    submit: async () => {
      const engine = getEngine()
      return engine?.submit()
    },
    
    reset: () => {
      const engine = getEngine()
      engine?.reset()
    }
  }
}

export default useFormEngine