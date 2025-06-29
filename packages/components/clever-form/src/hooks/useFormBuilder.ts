/**
 * useFormBuilder 组合式函数
 * @description 表单构建器逻辑的组合式API
 */

import { ref, computed, reactive, watch, nextTick, onUnmounted } from 'vue'
import type { UseFormBuilderOptions, UseFormBuilderReturn } from './types'
import type {
  FormBuilder,
  FormConfig,
  FieldConfig,
  ContainerConfig
} from '../types'
import { object, form as formUtils, error } from '../utils'
import { ERROR_CODES, COMPONENT_NAMES } from '../constants'

/**
 * 表单构建器组合式函数
 * @param options 配置选项
 * @returns 构建器状态和方法
 */
export function useFormBuilder(options: UseFormBuilderOptions = {}): UseFormBuilderReturn {
  const {
    initialConfig,
    draggable = true,
    components = {}
  } = options

  // 响应式状态
  const formBuilder = ref<FormBuilder | null>(null)
  const currentConfig = ref<FormConfig | undefined>(object.deepClone(initialConfig))
  const selectedItem = ref<any>(null)
  const editing = ref<boolean>(false)

  // 内部状态
  const history = ref<FormConfig[]>([])
  const historyIndex = ref<number>(-1)
  const maxHistorySize = 50
  const destroyed = ref<boolean>(false)

  // 计算属性
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const hasChanges = computed(() => {
    if (!initialConfig || !currentConfig.value) return false
    return JSON.stringify(initialConfig) !== JSON.stringify(currentConfig.value)
  })

  /**
   * 添加字段
   * @param field 字段配置
   * @param index 插入位置
   */
  const addField = (field: FieldConfig, index?: number): void => {
    if (destroyed.value || !currentConfig.value) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 确保有fields数组
      if (!config.fields) {
        config.fields = []
      }

      // 生成唯一ID
      if (!field.id) {
        field.id = generateFieldId(field.type)
      }

      // 插入字段
      if (typeof index === 'number' && index >= 0) {
        config.fields.splice(index, 0, field)
      } else {
        config.fields.push(field)
      }

      // 更新配置
      updateConfig(config)
      
      // 选中新添加的字段
      selectItem(field)
    } catch (err) {
      console.error('添加字段失败:', err)
    }
  }

  /**
   * 移除字段
   * @param index 字段索引
   */
  const removeField = (index: number): void => {
    if (destroyed.value || !currentConfig.value?.fields) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      if (index >= 0 && index < config.fields.length) {
        const removedField = config.fields[index]
        config.fields.splice(index, 1)
        
        // 如果删除的是选中项，清除选择
        if (selectedItem.value === removedField) {
          clearSelection()
        }
        
        updateConfig(config)
      }
    } catch (err) {
      console.error('移除字段失败:', err)
    }
  }

  /**
   * 更新字段
   * @param index 字段索引
   * @param field 新的字段配置
   */
  const updateField = (index: number, field: FieldConfig): void => {
    if (destroyed.value || !currentConfig.value?.fields) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      if (index >= 0 && index < config.fields.length) {
        config.fields[index] = { ...config.fields[index], ...field }
        updateConfig(config)
        
        // 更新选中项
        if (selectedItem.value && selectedItem.value.id === field.id) {
          selectedItem.value = config.fields[index]
        }
      }
    } catch (err) {
      console.error('更新字段失败:', err)
    }
  }

  /**
   * 移动字段
   * @param from 源位置
   * @param to 目标位置
   */
  const moveField = (from: number, to: number): void => {
    if (destroyed.value || !currentConfig.value?.fields) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      const fields = config.fields
      
      if (from >= 0 && from < fields.length && to >= 0 && to < fields.length && from !== to) {
        const field = fields.splice(from, 1)[0]
        fields.splice(to, 0, field)
        updateConfig(config)
      }
    } catch (err) {
      console.error('移动字段失败:', err)
    }
  }

  /**
   * 添加容器
   * @param container 容器配置
   * @param index 插入位置
   */
  const addContainer = (container: ContainerConfig, index?: number): void => {
    if (destroyed.value || !currentConfig.value) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      // 确保有containers数组
      if (!config.containers) {
        config.containers = []
      }

      // 生成唯一ID
      if (!container.id) {
        container.id = generateContainerId(container.type)
      }

      // 插入容器
      if (typeof index === 'number' && index >= 0) {
        config.containers.splice(index, 0, container)
      } else {
        config.containers.push(container)
      }

      updateConfig(config)
      selectItem(container)
    } catch (err) {
      console.error('添加容器失败:', err)
    }
  }

  /**
   * 移除容器
   * @param index 容器索引
   */
  const removeContainer = (index: number): void => {
    if (destroyed.value || !currentConfig.value?.containers) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      if (index >= 0 && index < config.containers.length) {
        const removedContainer = config.containers[index]
        config.containers.splice(index, 1)
        
        if (selectedItem.value === removedContainer) {
          clearSelection()
        }
        
        updateConfig(config)
      }
    } catch (err) {
      console.error('移除容器失败:', err)
    }
  }

  /**
   * 更新容器
   * @param index 容器索引
   * @param container 新的容器配置
   */
  const updateContainer = (index: number, container: ContainerConfig): void => {
    if (destroyed.value || !currentConfig.value?.containers) {
      return
    }

    try {
      const config = object.deepClone(currentConfig.value)
      
      if (index >= 0 && index < config.containers.length) {
        config.containers[index] = { ...config.containers[index], ...container }
        updateConfig(config)
        
        if (selectedItem.value && selectedItem.value.id === container.id) {
          selectedItem.value = config.containers[index]
        }
      }
    } catch (err) {
      console.error('更新容器失败:', err)
    }
  }

  /**
   * 选中项目
   * @param item 要选中的项目
   */
  const selectItem = (item: any): void => {
    selectedItem.value = item
    editing.value = true
  }

  /**
   * 清除选择
   */
  const clearSelection = (): void => {
    selectedItem.value = null
    editing.value = false
  }

  /**
   * 获取当前配置
   * @returns 表单配置
   */
  const getConfig = (): FormConfig => {
    return object.deepClone(currentConfig.value || {})
  }

  /**
   * 设置配置
   * @param config 表单配置
   */
  const setConfig = (config: FormConfig): void => {
    updateConfig(config)
    clearSelection()
  }

  /**
   * 重置到初始状态
   */
  const reset = (): void => {
    if (initialConfig) {
      setConfig(object.deepClone(initialConfig))
    } else {
      setConfig(createEmptyConfig())
    }
    
    // 清空历史记录
    history.value = []
    historyIndex.value = -1
  }

  /**
   * 撤销操作
   */
  const undo = (): void => {
    if (canUndo.value) {
      historyIndex.value--
      currentConfig.value = object.deepClone(history.value[historyIndex.value])
      clearSelection()
    }
  }

  /**
   * 重做操作
   */
  const redo = (): void => {
    if (canRedo.value) {
      historyIndex.value++
      currentConfig.value = object.deepClone(history.value[historyIndex.value])
      clearSelection()
    }
  }

  /**
   * 更新配置并记录历史
   * @param config 新配置
   */
  const updateConfig = (config: FormConfig): void => {
    // 添加到历史记录
    addToHistory(config)
    
    // 更新当前配置
    currentConfig.value = config
  }

  /**
   * 添加到历史记录
   * @param config 配置
   */
  const addToHistory = (config: FormConfig): void => {
    // 移除当前位置之后的历史记录
    if (historyIndex.value < history.value.length - 1) {
      history.value.splice(historyIndex.value + 1)
    }
    
    // 添加新记录
    history.value.push(object.deepClone(config))
    historyIndex.value = history.value.length - 1
    
    // 限制历史记录大小
    if (history.value.length > maxHistorySize) {
      history.value.shift()
      historyIndex.value--
    }
  }

  /**
   * 生成字段ID
   * @param type 字段类型
   * @returns 字段ID
   */
  const generateFieldId = (type: string): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5)
    return `${type}_${timestamp}_${random}`
  }

  /**
   * 生成容器ID
   * @param type 容器类型
   * @returns 容器ID
   */
  const generateContainerId = (type: string): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5)
    return `${type}_container_${timestamp}_${random}`
  }

  /**
   * 创建空配置
   * @returns 空的表单配置
   */
  const createEmptyConfig = (): FormConfig => {
    return {
      id: 'form_' + Date.now(),
      title: '新建表单',
      fields: [],
      containers: [],
      layout: {
        type: 'vertical',
        cols: 1,
        gutter: 16
      }
    }
  }

  // 初始化
  if (currentConfig.value) {
    addToHistory(currentConfig.value)
  } else {
    const emptyConfig = createEmptyConfig()
    currentConfig.value = emptyConfig
    addToHistory(emptyConfig)
  }

  // 清理资源
  onUnmounted(() => {
    destroyed.value = true
  })

  return {
    formBuilder,
    currentConfig,
    selectedItem,
    editing,
    addField,
    removeField,
    updateField,
    moveField,
    addContainer,
    removeContainer,
    updateContainer,
    selectItem,
    clearSelection,
    getConfig,
    setConfig,
    reset,
    // 扩展方法
    undo,
    redo,
    canUndo,
    canRedo,
    hasChanges
  } as UseFormBuilderReturn & {
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
    hasChanges: boolean
  }
}