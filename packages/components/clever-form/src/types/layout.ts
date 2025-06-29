/**
 * 布局相关类型定义
 * @description 定义表单布局容器的所有相关类型
 */

import type { VNode, Component } from 'vue'
import type {
  BaseComponentProps,
  ConditionalFunction,
  ResponsiveConfig,
  Direction,
  Align
} from './common'
import type { FieldConfig } from './field'

// 容器类型
export type ContainerType =
  | 'grid'      // 网格布局
  | 'flex'      // 弹性布局
  | 'tabs'      // 标签页布局
  | 'group'     // 分组布局
  | 'inline'    // 行内布局
  | 'vertical'  // 垂直布局
  | 'card'      // 卡片布局
  | 'collapse'  // 折叠面板布局
  | 'steps'     // 步骤布局
  | 'custom'    // 自定义布局

// 基础容器配置
export interface BaseContainerConfig extends BaseComponentProps {
  // 容器类型
  type: ContainerType
  // 容器标题
  title?: string
  // 容器描述
  description?: string
  // 条件显示
  show?: boolean | ConditionalFunction
  // 子项配置
  children: Array<FieldConfig | ContainerConfig>
  // 响应式配置
  responsive?: ResponsiveConfig
  // 容器属性
  props?: Record<string, any>
  // 自定义渲染
  render?: (children: VNode[], config: BaseContainerConfig) => VNode
  // 容器样式类
  containerClass?: string
  // 容器内联样式
  containerStyle?: string | Record<string, any>
}

// 网格布局配置
export interface GridContainerConfig extends BaseContainerConfig {
  type: 'grid'
  props?: {
    // 列数配置
    cols?: number | ResponsiveConfig
    // 行间距
    rowGap?: number | string
    // 列间距
    colGap?: number | string
    // 网格项配置
    itemProps?: {
      // 跨列数
      span?: number | ResponsiveConfig
      // 列偏移
      offset?: number | ResponsiveConfig
      // 行跨越
      rowSpan?: number
      // 列跨越
      colSpan?: number
      // 对齐方式
      align?: 'start' | 'center' | 'end' | 'stretch'
      // 垂直对齐
      justify?: 'start' | 'center' | 'end' | 'stretch'
    }
    [key: string]: any
  }
}

// 弹性布局配置
export interface FlexContainerConfig extends BaseContainerConfig {
  type: 'flex'
  props?: {
    // 主轴方向
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    // 主轴对齐
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    // 交叉轴对齐
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
    // 换行
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    // 间距
    gap?: number | string
    // 弹性项配置
    itemProps?: {
      // 弹性增长
      flex?: number | string
      // 弹性收缩
      shrink?: number
      // 弹性基础
      basis?: number | string
      // 对齐方式
      alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
      // 排序
      order?: number
    }
    [key: string]: any
  }
}

// 标签页布局配置
export interface TabsContainerConfig extends BaseContainerConfig {
  type: 'tabs'
  props?: {
    // 标签页类型
    type?: 'line' | 'card' | 'segment'
    // 标签页位置
    placement?: 'top' | 'right' | 'bottom' | 'left'
    // 默认激活标签
    defaultValue?: string
    // 是否可关闭
    closable?: boolean
    // 是否可添加
    addable?: boolean
    // 标签页配置
    tabs?: Array<{
      // 标签键值
      key: string
      // 标签标题
      label: string
      // 标签图标
      icon?: Component
      // 是否禁用
      disabled?: boolean
      // 是否可关闭
      closable?: boolean
      // 标签内容
      children: Array<FieldConfig | ContainerConfig>
    }>
    [key: string]: any
  }
}

// 分组布局配置
export interface GroupContainerConfig extends BaseContainerConfig {
  type: 'group'
  props?: {
    // 是否可折叠
    collapsible?: boolean
    // 默认展开状态
    defaultExpanded?: boolean
    // 显示边框
    bordered?: boolean
    // 显示箭头
    showArrow?: boolean
    // 标题对齐
    titleAlign?: Align
    // 标题图标
    titleIcon?: Component
    // 标题额外内容
    titleExtra?: VNode | (() => VNode)
    [key: string]: any
  }
}

// 行内布局配置
export interface InlineContainerConfig extends BaseContainerConfig {
  type: 'inline'
  props?: {
    // 间距
    gap?: number | string
    // 对齐方式
    align?: 'start' | 'center' | 'end' | 'baseline'
    // 换行
    wrap?: boolean
    [key: string]: any
  }
}

// 垂直布局配置
export interface VerticalContainerConfig extends BaseContainerConfig {
  type: 'vertical'
  props?: {
    // 间距
    gap?: number | string
    // 对齐方式
    align?: 'start' | 'center' | 'end' | 'stretch'
    [key: string]: any
  }
}

// 卡片布局配置
export interface CardContainerConfig extends BaseContainerConfig {
  type: 'card'
  props?: {
    // 显示边框
    bordered?: boolean
    // 显示阴影
    hoverable?: boolean
    // 卡片大小
    size?: 'small' | 'medium' | 'large'
    // 头部配置
    header?: {
      title?: string
      extra?: VNode | (() => VNode)
    }
    // 底部配置
    footer?: VNode | (() => VNode)
    [key: string]: any
  }
}

// 折叠面板布局配置
export interface CollapseContainerConfig extends BaseContainerConfig {
  type: 'collapse'
  props?: {
    // 手风琴模式
    accordion?: boolean
    // 默认展开的面板
    defaultExpandedNames?: string[]
    // 面板配置
    panels?: Array<{
      // 面板键值
      key: string
      // 面板标题
      title: string
      // 面板图标
      icon?: Component
      // 是否禁用
      disabled?: boolean
      // 面板内容
      children: Array<FieldConfig | ContainerConfig>
    }>
    [key: string]: any
  }
}

// 步骤布局配置
export interface StepsContainerConfig extends BaseContainerConfig {
  type: 'steps'
  props?: {
    // 当前步骤
    current?: number
    // 步骤状态
    status?: 'wait' | 'process' | 'finish' | 'error'
    // 步骤方向
    direction?: Direction
    // 步骤大小
    size?: 'small' | 'medium'
    // 步骤配置
    steps?: Array<{
      // 步骤标题
      title: string
      // 步骤描述
      description?: string
      // 步骤图标
      icon?: Component
      // 步骤状态
      status?: 'wait' | 'process' | 'finish' | 'error'
      // 是否禁用
      disabled?: boolean
      // 步骤内容
      children: Array<FieldConfig | ContainerConfig>
    }>
    [key: string]: any
  }
}

// 自定义布局配置
export interface CustomContainerConfig extends BaseContainerConfig {
  type: 'custom'
  // 自定义组件
  customComponent: Component | (() => Component)
  // 自定义属性
  customProps?: Record<string, any>
}

// 容器配置联合类型
export type ContainerConfig =
  | GridContainerConfig
  | FlexContainerConfig
  | TabsContainerConfig
  | GroupContainerConfig
  | InlineContainerConfig
  | VerticalContainerConfig
  | CardContainerConfig
  | CollapseContainerConfig
  | StepsContainerConfig
  | CustomContainerConfig

// 布局项配置
export interface LayoutItemConfig {
  // 项目类型
  type: 'field' | 'container'
  // 项目配置
  config: FieldConfig | ContainerConfig
  // 布局属性
  layoutProps?: {
    // 跨度
    span?: number | ResponsiveConfig
    // 偏移
    offset?: number | ResponsiveConfig
    // 排序
    order?: number
    // 对齐
    align?: string
    // 弹性
    flex?: number | string
  }
}

// 布局状态
export interface LayoutState {
  // 当前激活的标签页
  activeTab?: string
  // 展开的分组
  expandedGroups: string[]
  // 展开的折叠面板
  expandedPanels: string[]
  // 当前步骤
  currentStep: number
  // 响应式断点
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

// 布局事件类型
export interface LayoutEvents {
  // 标签页切换
  'tab:change': (key: string) => void
  // 分组展开/折叠
  'group:toggle': (key: string, expanded: boolean) => void
  // 折叠面板展开/折叠
  'panel:toggle': (key: string, expanded: boolean) => void
  // 步骤切换
  'step:change': (step: number) => void
  // 响应式断点变化
  'breakpoint:change': (breakpoint: string) => void
}

// 布局渲染器接口
export interface LayoutRenderer {
  // 渲染容器
  renderContainer(config: ContainerConfig, children: VNode[]): VNode
  // 渲染字段
  renderField(config: FieldConfig): VNode
  // 解析布局
  parseLayout(config: ContainerConfig): LayoutItemConfig[]
  // 验证布局
  validateLayout(config: ContainerConfig): boolean
}