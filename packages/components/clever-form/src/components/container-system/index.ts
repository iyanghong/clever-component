/**
 * 容器系统导出
 * 提供各种布局容器组件的统一导出
 */

// 容器渲染器
export { default as ContainerRenderer } from './ContainerRenderer.vue'
export { default as GridContainer } from './GridContainer.vue'
export { default as FlexContainer } from './FlexContainer.vue'
export { default as TabsContainer } from './TabsContainer.vue'
export { default as CollapseContainer } from './CollapseContainer.vue'
export { default as VerticalContainer } from './VerticalContainer.vue'
export { default as InlineContainer } from './InlineContainer.vue'
export { default as GroupContainer } from './GroupContainer.vue'
export { default as CardContainer } from './CardContainer.vue'
export { default as StepsContainer } from './StepsContainer.vue'
export { default as CustomContainer } from './CustomContainer.vue'

/**
 * 容器组件映射表
 * 用于根据容器类型动态渲染对应的组件
 */
export const CONTAINER_COMPONENT_MAP = {
  grid: 'GridContainer',
  flex: 'FlexContainer',
  tabs: 'TabsContainer',
  collapse: 'CollapseContainer',
  vertical: 'VerticalContainer',
  inline: 'InlineContainer',
  group: 'GroupContainer',
  card: 'CardContainer',
  steps: 'StepsContainer',
  custom: 'CustomContainer' // 自定义容器通过 customComponent 属性处理
} as const

// 容器组件类型
export type ContainerComponentType = keyof typeof CONTAINER_COMPONENT_MAP

// 容器组件名称
export type ContainerComponentName = typeof CONTAINER_COMPONENT_MAP[ContainerComponentType]