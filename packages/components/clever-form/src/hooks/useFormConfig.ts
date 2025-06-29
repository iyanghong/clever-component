/**
 * 表单配置管理 Hook
 * @description 提供表单配置管理相关的组合式API
 */

import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { FormSchema, FormConfig, FieldConfig } from '../types'

export interface UseFormConfigOptions {
  schemas?: FormSchema[]
  config?: Partial<FormConfig>
  responsive?: boolean
  breakpoints?: Record<string, number>
}

export interface UseFormConfigReturn {
  schemas: Ref<FormSchema[]>
  config: Ref<FormConfig>
  fieldConfigs: Ref<Record<string, FieldConfig>>
  currentBreakpoint: Ref<string>
  isMobile: Ref<boolean>
  isTablet: Ref<boolean>
  isDesktop: Ref<boolean>
  addField: (schema: FormSchema, index?: number) => void
  removeField: (field: string) => void
  updateField: (field: string, updates: Partial<FormSchema>) => void
  moveField: (field: string, newIndex: number) => void
  getFieldConfig: (field: string) => FieldConfig | undefined
  updateFieldConfig: (field: string, config: Partial<FieldConfig>) => void
  updateFormConfig: (updates: Partial<FormConfig>) => void
  resetConfig: () => void
  exportConfig: () => { schemas: FormSchema[]; config: FormConfig }
  importConfig: (data: { schemas: FormSchema[]; config: FormConfig }) => void
}

/**
 * 默认表单配置
 */
const defaultFormConfig: FormConfig = {
  labelWidth: 'auto',
  labelPlacement: 'left',
  size: 'medium',
  disabled: false,
  readonly: false,
  showFeedback: true,
  showLabel: true,
  showRequiredMark: true,
  requireMarkPlacement: 'right',
  validationTrigger: 'blur',
  scrollToError: true,
  submitOnEnter: false,
  resetOnSubmit: false,
  autoFocus: false,
  colon: false,
  inline: false,
  responsive: true,
  grid: {
    cols: 24,
    xGap: 16,
    yGap: 16
  },
  layout: {
    type: 'grid',
    direction: 'vertical',
    justify: 'start',
    align: 'start'
  }
}

/**
 * 默认断点配置
 */
const defaultBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

/**
 * 表单配置管理
 */
export function useFormConfig(options: UseFormConfigOptions = {}): UseFormConfigReturn {
  const {
    schemas: initialSchemas = [],
    config: initialConfig = {},
    responsive = true,
    breakpoints = defaultBreakpoints
  } = options

  // 表单字段配置
  const schemas = ref<FormSchema[]>([...initialSchemas])
  
  // 表单配置
  const config = ref<FormConfig>({
    ...defaultFormConfig,
    ...initialConfig
  })
  
  // 字段配置映射
  const fieldConfigs = ref<Record<string, FieldConfig>>({})
  
  // 当前断点
  const currentBreakpoint = ref<string>('lg')
  
  // 窗口宽度
  const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1200)

  // 响应式计算属性
  const isMobile = computed(() => currentBreakpoint.value === 'xs' || currentBreakpoint.value === 'sm')
  const isTablet = computed(() => currentBreakpoint.value === 'md')
  const isDesktop = computed(() => ['lg', 'xl', 'xxl'].includes(currentBreakpoint.value))

  /**
   * 更新当前断点
   */
  const updateBreakpoint = () => {
    const width = windowWidth.value
    let breakpoint = 'xs'
    
    Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a)
      .forEach(([key, value]) => {
        if (width >= value) {
          breakpoint = key
          return
        }
      })
    
    currentBreakpoint.value = breakpoint
  }

  /**
   * 添加字段
   */
  const addField = (schema: FormSchema, index?: number) => {
    if (index !== undefined && index >= 0 && index <= schemas.value.length) {
      schemas.value.splice(index, 0, schema)
    } else {
      schemas.value.push(schema)
    }
    
    // 初始化字段配置
    if (schema.field) {
      fieldConfigs.value[schema.field] = {
        visible: true,
        disabled: false,
        readonly: false,
        required: schema.required || false,
        ...schema.config
      }
    }
  }

  /**
   * 移除字段
   */
  const removeField = (field: string) => {
    const index = schemas.value.findIndex(schema => schema.field === field)
    if (index > -1) {
      schemas.value.splice(index, 1)
      delete fieldConfigs.value[field]
    }
  }

  /**
   * 更新字段
   */
  const updateField = (field: string, updates: Partial<FormSchema>) => {
    const index = schemas.value.findIndex(schema => schema.field === field)
    if (index > -1) {
      schemas.value[index] = { ...schemas.value[index], ...updates }
      
      // 同步更新字段配置
      if (updates.config) {
        fieldConfigs.value[field] = {
          ...fieldConfigs.value[field],
          ...updates.config
        }
      }
    }
  }

  /**
   * 移动字段位置
   */
  const moveField = (field: string, newIndex: number) => {
    const currentIndex = schemas.value.findIndex(schema => schema.field === field)
    if (currentIndex > -1 && newIndex >= 0 && newIndex < schemas.value.length) {
      const [schema] = schemas.value.splice(currentIndex, 1)
      schemas.value.splice(newIndex, 0, schema)
    }
  }

  /**
   * 获取字段配置
   */
  const getFieldConfig = (field: string): FieldConfig | undefined => {
    return fieldConfigs.value[field]
  }

  /**
   * 更新字段配置
   */
  const updateFieldConfig = (field: string, configUpdates: Partial<FieldConfig>) => {
    if (fieldConfigs.value[field]) {
      fieldConfigs.value[field] = {
        ...fieldConfigs.value[field],
        ...configUpdates
      }
    } else {
      fieldConfigs.value[field] = {
        visible: true,
        disabled: false,
        readonly: false,
        required: false,
        ...configUpdates
      }
    }
  }

  /**
   * 更新表单配置
   */
  const updateFormConfig = (updates: Partial<FormConfig>) => {
    config.value = { ...config.value, ...updates }
  }

  /**
   * 重置配置
   */
  const resetConfig = () => {
    config.value = { ...defaultFormConfig }
    fieldConfigs.value = {}
    
    // 重新初始化字段配置
    schemas.value.forEach(schema => {
      if (schema.field) {
        fieldConfigs.value[schema.field] = {
          visible: true,
          disabled: false,
          readonly: false,
          required: schema.required || false,
          ...schema.config
        }
      }
    })
  }

  /**
   * 导出配置
   */
  const exportConfig = () => {
    return {
      schemas: schemas.value.map(schema => ({ ...schema })),
      config: { ...config.value }
    }
  }

  /**
   * 导入配置
   */
  const importConfig = (data: { schemas: FormSchema[]; config: FormConfig }) => {
    schemas.value = [...data.schemas]
    config.value = { ...defaultFormConfig, ...data.config }
    
    // 重新初始化字段配置
    fieldConfigs.value = {}
    schemas.value.forEach(schema => {
      if (schema.field) {
        fieldConfigs.value[schema.field] = {
          visible: true,
          disabled: false,
          readonly: false,
          required: schema.required || false,
          ...schema.config
        }
      }
    })
  }

  // 初始化字段配置
  const initializeFieldConfigs = () => {
    schemas.value.forEach(schema => {
      if (schema.field) {
        fieldConfigs.value[schema.field] = {
          visible: true,
          disabled: false,
          readonly: false,
          required: schema.required || false,
          ...schema.config
        }
      }
    })
  }

  // 监听窗口大小变化
  if (responsive && typeof window !== 'undefined') {
    const handleResize = () => {
      windowWidth.value = window.innerWidth
      updateBreakpoint()
    }
    
    window.addEventListener('resize', handleResize)
    updateBreakpoint()
    
    // 清理事件监听器
    const cleanup = () => {
      window.removeEventListener('resize', handleResize)
    }
    
    // 这里可以在组件卸载时调用 cleanup
  }

  // 监听 schemas 变化
  watch(
    () => schemas.value,
    () => {
      initializeFieldConfigs()
    },
    { deep: true, immediate: true }
  )

  return {
    schemas,
    config,
    fieldConfigs,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    addField,
    removeField,
    updateField,
    moveField,
    getFieldConfig,
    updateFieldConfig,
    updateFormConfig,
    resetConfig,
    exportConfig,
    importConfig
  }
}

export default useFormConfig