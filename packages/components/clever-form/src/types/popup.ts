/**
 * 弹窗相关类型定义
 * @description 定义表单弹窗集成的所有相关类型
 */

import type { VNode, Component } from 'vue'
import type { ModalProps, DrawerProps } from 'naive-ui'
import type { Size, BaseComponentProps } from './common'
import type { FormData } from './form'

// 弹窗类型
export type PopupType = 'modal' | 'drawer'

// 弹窗模式
export type PopupMode = 'create' | 'edit' | 'view' | 'confirm'

// 弹窗状态
export type PopupStatus = 'closed' | 'opening' | 'opened' | 'closing' | 'loading' | 'submitting'

// 弹窗位置
export type PopupPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center'

// 弹窗大小预设
export type PopupSize = Size | 'auto' | 'fullscreen'

// 基础弹窗配置
export interface BasePopupConfig extends BaseComponentProps {
  // 弹窗类型
  type: PopupType
  // 弹窗标题
  title?: string
  // 弹窗大小
  size?: PopupSize
  // 自定义宽度
  width?: number | string
  // 自定义高度
  height?: number | string
  // 是否可关闭
  closable?: boolean
  // 是否显示遮罩
  mask?: boolean
  // 点击遮罩是否关闭
  maskClosable?: boolean
  // 按ESC是否关闭
  escClosable?: boolean
  // 是否自动聚焦
  autoFocus?: boolean
  // 关闭时销毁内容
  destroyOnClose?: boolean
  // 弹窗层级
  zIndex?: number
  // 自定义样式类
  customClass?: string
  // 自定义内联样式
  customStyle?: string | Record<string, any>
  // 动画配置
  animation?: {
    // 进入动画
    enter?: string
    // 离开动画
    leave?: string
    // 动画持续时间
    duration?: number
  }
}

// Modal弹窗配置
export interface ModalPopupConfig extends BasePopupConfig {
  type: 'modal'
  // Modal特有属性
  props?: Partial<ModalProps> & {
    // 是否居中显示
    centered?: boolean
    // 最大宽度
    maxWidth?: number | string
    // 最大高度
    maxHeight?: number | string
    // 是否可拖拽
    draggable?: boolean
    // 是否可调整大小
    resizable?: boolean
    // 头部配置
    header?: {
      // 是否显示头部
      show?: boolean
      // 头部内容
      content?: VNode | (() => VNode)
      // 头部样式
      style?: string | Record<string, any>
    }
    // 底部配置
    footer?: {
      // 是否显示底部
      show?: boolean
      // 底部内容
      content?: VNode | (() => VNode)
      // 底部样式
      style?: string | Record<string, any>
    }
  }
}

// Drawer弹窗配置
export interface DrawerPopupConfig extends BasePopupConfig {
  type: 'drawer'
  // 抽屉位置
  placement?: PopupPlacement
  // Drawer特有属性
  props?: Partial<DrawerProps> & {
    // 是否显示头部
    showHeader?: boolean
    // 是否显示底部
    showFooter?: boolean
    // 头部高度
    headerHeight?: number | string
    // 底部高度
    footerHeight?: number | string
    // 内容区域样式
    bodyStyle?: string | Record<string, any>
    // 头部样式
    headerStyle?: string | Record<string, any>
    // 底部样式
    footerStyle?: string | Record<string, any>
  }
}

// 弹窗配置联合类型
export type PopupConfig = ModalPopupConfig | DrawerPopupConfig

// 弹窗按钮配置
export interface PopupButtonConfig {
  // 按钮文本
  text: string
  // 按钮类型
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  // 按钮大小
  size?: Size
  // 是否禁用
  disabled?: boolean
  // 是否加载中
  loading?: boolean
  // 按钮图标
  icon?: Component
  // 点击事件
  onClick?: (data?: FormData) => void | Promise<void>
  // 是否显示
  show?: boolean | ((data?: FormData) => boolean)
  // 按钮样式
  style?: string | Record<string, any>
  // 按钮类名
  class?: string
  // 自定义属性
  props?: Record<string, any>
}

// 弹窗操作配置
export interface PopupActionsConfig {
  // 确认按钮
  confirm?: PopupButtonConfig
  // 取消按钮
  cancel?: PopupButtonConfig
  // 重置按钮
  reset?: PopupButtonConfig
  // 自定义按钮
  custom?: PopupButtonConfig[]
  // 按钮对齐方式
  align?: 'left' | 'center' | 'right'
  // 按钮间距
  gap?: number | string
  // 是否显示操作栏
  show?: boolean
  // 操作栏样式
  style?: string | Record<string, any>
}

// 弹窗状态
export interface PopupState {
  // 弹窗状态
  status: PopupStatus
  // 是否可见
  visible: boolean
  // 是否正在加载
  loading: boolean
  // 是否正在提交
  submitting: boolean
  // 弹窗模式
  mode: PopupMode
  // 弹窗数据
  data?: FormData
  // 错误信息
  error?: string
  // 打开时间
  openTime?: number
  // 关闭时间
  closeTime?: number
}

// 弹窗事件类型
export interface PopupEvents {
  // 弹窗打开前
  'open:before': (mode: PopupMode, data?: FormData) => void | Promise<void>
  // 弹窗打开
  'open': (mode: PopupMode, data?: FormData) => void
  // 弹窗打开后
  'open:after': (mode: PopupMode, data?: FormData) => void
  // 弹窗关闭前
  'close:before': (reason?: string) => void | Promise<void>
  // 弹窗关闭
  'close': (reason?: string) => void
  // 弹窗关闭后
  'close:after': (reason?: string) => void
  // 确认操作
  'confirm': (data: FormData) => void | Promise<void>
  // 取消操作
  'cancel': () => void
  // 重置操作
  'reset': () => void
  // 状态变化
  'status:change': (status: PopupStatus, prevStatus: PopupStatus) => void
  // 模式变化
  'mode:change': (mode: PopupMode, prevMode: PopupMode) => void
  // 数据变化
  'data:change': (data: FormData) => void
  // 错误发生
  'error': (error: Error) => void
}

// 弹窗方法接口
export interface PopupMethods {
  // 打开弹窗
  open(mode?: PopupMode, data?: FormData): Promise<void>
  // 关闭弹窗
  close(reason?: string): Promise<void>
  // 确认操作
  confirm(): Promise<any>
  // 取消操作
  cancel(): void
  // 重置操作
  reset(): void
  // 获取弹窗状态
  getState(): PopupState
  // 设置加载状态
  setLoading(loading: boolean): void
  // 设置提交状态
  setSubmitting(submitting: boolean): void
  // 设置错误信息
  setError(error?: string): void
  // 清除错误
  clearError(): void
  // 更新配置
  updateConfig(config: Partial<PopupConfig>): void
}

// 弹窗管理器接口
export interface PopupManager extends PopupMethods {
  // 弹窗配置
  config: PopupConfig
  // 弹窗状态
  state: PopupState
  // 事件总线
  events: Record<keyof PopupEvents, Function[]>
  // 初始化弹窗
  initialize(config: PopupConfig): void
  // 渲染弹窗
  render(content: VNode): VNode
  // 监听事件
  on<K extends keyof PopupEvents>(event: K, handler: PopupEvents[K]): void
  // 移除事件监听
  off<K extends keyof PopupEvents>(event: K, handler?: PopupEvents[K]): void
  // 触发事件
  emit<K extends keyof PopupEvents>(event: K, ...args: Parameters<PopupEvents[K]>): void
  // 销毁弹窗
  destroy(): void
}

// 弹窗渲染器接口
export interface PopupRenderer {
  // 渲染弹窗
  render(config: PopupConfig, content: VNode, manager: PopupManager): VNode
  // 渲染头部
  renderHeader(config: PopupConfig, manager: PopupManager): VNode
  // 渲染内容
  renderContent(content: VNode, config: PopupConfig): VNode
  // 渲染底部
  renderFooter(config: PopupConfig, manager: PopupManager): VNode
  // 渲染操作按钮
  renderActions(actions: PopupActionsConfig, manager: PopupManager): VNode
  // 渲染加载状态
  renderLoading(config: PopupConfig): VNode
}

// 弹窗工厂接口
export interface PopupFactory {
  // 创建弹窗管理器
  createManager(config: PopupConfig): PopupManager
  // 创建Modal弹窗
  createModal(config: ModalPopupConfig): PopupManager
  // 创建Drawer弹窗
  createDrawer(config: DrawerPopupConfig): PopupManager
  // 注册弹窗类型
  registerType(type: string, renderer: PopupRenderer): void
  // 注册弹窗中间件
  registerMiddleware(middleware: PopupMiddleware): void
}

// 弹窗中间件接口
export interface PopupMiddleware {
  // 中间件名称
  name: string
  // 执行顺序
  order?: number
  // 打开前钩子
  onBeforeOpen?(manager: PopupManager, mode: PopupMode, data?: FormData): void | Promise<void>
  // 打开后钩子
  onAfterOpen?(manager: PopupManager, mode: PopupMode, data?: FormData): void
  // 关闭前钩子
  onBeforeClose?(manager: PopupManager, reason?: string): void | Promise<void>
  // 关闭后钩子
  onAfterClose?(manager: PopupManager, reason?: string): void
  // 确认前钩子
  onBeforeConfirm?(manager: PopupManager, data: FormData): void | Promise<void>
  // 确认后钩子
  onAfterConfirm?(manager: PopupManager, result: any): void
  // 错误处理钩子
  onError?(manager: PopupManager, error: Error): void
}

// 弹窗插件接口
export interface PopupPlugin {
  // 插件名称
  name: string
  // 插件版本
  version?: string
  // 安装插件
  install(factory: PopupFactory): void
  // 卸载插件
  uninstall?(factory: PopupFactory): void
  // 插件配置
  options?: Record<string, any>
}

// 弹窗上下文
export interface PopupContext {
  // 弹窗管理器
  manager: PopupManager
  // 弹窗配置
  config: PopupConfig
  // 弹窗状态
  state: PopupState
  // 弹窗方法
  methods: PopupMethods
  // 父级上下文
  parent?: PopupContext
}

// 弹窗提供者属性
export interface PopupProviderProps extends BaseComponentProps {
  // 弹窗配置
  config: PopupConfig
  // 是否可见
  visible?: boolean
  // 弹窗模式
  mode?: PopupMode
  // 弹窗数据
  data?: FormData
  // 操作配置
  actions?: PopupActionsConfig
}

// 弹窗提供者事件
export interface PopupProviderEvents {
  // 可见性变化
  'update:visible': (visible: boolean) => void
  // 模式变化
  'update:mode': (mode: PopupMode) => void
  // 数据变化
  'update:data': (data: FormData) => void
  // 确认事件
  'confirm': (data: FormData) => void
  // 取消事件
  'cancel': () => void
  // 重置事件
  'reset': () => void
}

// 弹窗组件属性
export interface CleverPopupProps extends PopupProviderProps {
  // 自定义渲染器
  renderer?: PopupRenderer
  // 中间件列表
  middlewares?: PopupMiddleware[]
  // 插件列表
  plugins?: PopupPlugin[]
}

// 弹窗组件事件
export interface CleverPopupEvents extends PopupProviderEvents {
  // 打开事件
  'open': (mode: PopupMode, data?: FormData) => void
  // 关闭事件
  'close': (reason?: string) => void
  // 状态变化
  'status:change': (status: PopupStatus) => void
  // 错误事件
  'error': (error: Error) => void
}

// 弹窗组件暴露的方法
export interface CleverPopupExposed extends PopupMethods {
  // 获取弹窗管理器
  getManager(): PopupManager
  // 获取弹窗上下文
  getContext(): PopupContext
}