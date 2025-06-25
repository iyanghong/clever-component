import type { ButtonProps } from 'naive-ui/lib/button'
import type { Ref } from 'vue'
import type { CleverFormMethods, FormFieldSchema, FormSchema } from './form'

/**
 * useForm Hook 返回值类型定义
 */
export interface UseFormReturn<T extends Record<string, any> = any> {
  // 响应式数据
  /** 表单引用 */
  formRef: Ref<any>
  /** 表单数据模型 */
  formModel: Ref<T>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 折叠状态 */
  collapsed: Ref<boolean>
  /** 是否只显示一行 */
  isOnlyShowOneRow: () => boolean
  /** 表单项字段键 */
  formItemFieldKeys: Ref<Record<string, string>>
  /** 设置字段值 */
  setFieldValue: (field: keyof T, value: any) => void
  /** 获取字段值 */
  getFieldValue: (field: keyof T) => any
  /** 设置表单数据 */
  setFormData: (values: Partial<T>) => void
  /** 获取表单数据 */
  getFormData: () => T

  // 计算属性和方法
  /** 获取schema */
  getSchema: () => FormSchema[]
  /** 获取实际的schemas */
  getActualSchemas: () => FormSchema[]
  /** 获取实际的布局配置 */
  getActualLayoutConfig: () => Record<string, any>

  // 表单项相关方法
  /** 获取表单项属性 */
  getFormItemProps: (schema: FormFieldSchema) => Record<string, any>
  /** 获取组件属性 */
  getComponentProps: (schema: FormFieldSchema) => Record<string, any>
  /** 递归获取所有字段的校验规则 */
  getAllFieldRules: () => Record<string, any>
  /** 获取网格属性 */
  getGrid: () => Record<string, any>
  /** 获取重置按钮选项 */
  getResetBtnOptions: () => ButtonProps
  /** 获取提交按钮选项 */
  getSubmitBtnOptions: () => ButtonProps
  /** 获取分组schemas */
  getGroupedSchemas: () => Array<{
    name: string
    title: string
    fields: FormFieldSchema[]
  }>
  /** 判断表单项是否显示 */
  ifShowFormItem: (schema: FormFieldSchema<T>) => boolean
  /** 获取flex样式 */
  getFlexStyle: () => Record<string, any>
  /** 获取flex项样式 */
  getFlexItemStyle: (schema: FormFieldSchema) => Record<string, any>

  // 表单操作方法
  /** 字段变化处理 */
  handleFieldChange: (
    schema: FormFieldSchema,
    newValue: any,
    oldValue: any
  ) => void
  /** 重置表单 */
  handleReset: () => void
  /** 提交表单 */
  handleSubmit: () => Promise<void>
  /** 切换折叠状态 */
  unfoldToggle: () => void

  // 表单验证和操作
  /** 重置字段 */
  resetFields: () => Promise<void>
  /** 清除验证 */
  clearValidate: (name?: string | string[]) => Promise<void>
  /** 验证表单 */
  validate: (nameList?: any[]) => Promise<any>

  // 工具方法
  /** 判断是否为表单字段schema */
  isFormFieldSchema: (schema: any) => boolean
  /** 获取实际组件 */
  getActualComponent: (componentType: string) => any
  /** 获取属性 */
  getProps: () => Record<string, any>
  /** 获取表单组件 */
  getFormComponent: (schema: FormSchema) => string

  // 表单方法集合
  /** 表单方法集合 */
  methods: CleverFormMethods<T>
}

/**
 * LayoutRenderer 组件专用的 Props 类型
 * 从 UseFormReturn 中提取 LayoutRenderer 需要的属性
 */
export interface LayoutRendererFormProps {
  /** 获取表单项属性 */
  getFormItemProps: (schema: FormFieldSchema) => Record<string, any>
  /** 获取组件属性 */
  getComponentProps: (schema: FormFieldSchema) => Record<string, any>
  /** 获取网格属性 */
  getGrid: () => Record<string, any>
  /** 获取重置按钮选项 */
  getResetBtnOptions: () => ButtonProps
  /** 获取提交按钮选项 */
  getSubmitBtnOptions: () => ButtonProps
  /** 获取分组schemas */
  getGroupedSchemas: () => Array<{
    name: string
    title: string
    fields: FormFieldSchema[]
  }>
  /** 判断表单项是否显示 */
  ifShowFormItem: (schema: FormFieldSchema) => boolean
  /** 获取flex项样式 */
  getFlexItemStyle: (schema: FormFieldSchema) => Record<string, any>
  /** 字段变化处理 */
  handleFieldChange: (
    schema: FormFieldSchema,
    newValue: any,
    oldValue: any
  ) => void
}
