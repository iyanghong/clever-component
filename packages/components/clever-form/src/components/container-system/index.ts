/**
 * 容器系统导出
 * 提供各种布局容器组件的统一导出
 */

// 容器渲染器
export { default as ContainerRenderer } from './ContainerRenderer.vue'

// 布局容器
export { default as GridContainer } from './GridContainer.vue'
export { default as FlexContainer } from './FlexContainer.vue'
export { default as TabsContainer } from './TabsContainer.vue'
export { default as CollapseContainer } from './CollapseContainer.vue'

// 容器组件类型映射
export const CONTAINER_COMPONENT_MAP = {
  grid: 'GridContainer',
  flex: 'FlexContainer',
  tabs: 'TabsContainer',
  collapse: 'CollapseContainer'
} as const

// 容器组件类型
export type ContainerComponentType = keyof typeof CONTAINER_COMPONENT_MAP

// 容器组件名称
export type ContainerComponentName = typeof CONTAINER_COMPONENT_MAP[ContainerComponentType]