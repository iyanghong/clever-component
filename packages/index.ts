import type { App } from 'vue'

// 导入工具函数和组合式函数
export * from './components'
export * from './composables'
export * from './utils'

// 重新导出组件（避免重复导入）
export { default as CleverForm } from './components/clever-form/src/components/CleverForm/index.vue'
export { default as CleverPopup } from './components/clever-popup/index.vue'
export { default as CleverTable } from './components/clever-table/index.vue'
// 导出类型
export type {
  CleverFormProps,
  FormSchema,
  CleverFormMethods,
  UseFormReturnType
} from './components/clever-form/src/types/form'
export type { ComponentType } from './components/clever-form/src/types/index'
export type { CleverPopupProps } from './components/clever-popup/types'
export type {
  CleverTableProps,
  TableColumn,
  TableAction,
  HeaderAction,
  SearchConfig,
  ApiConfig,
  PaginationConfig,
  CleverTableMethods,
  UseTableReturnType
} from './components/clever-table/src/types/index'

// 动态导入组件用于安装
import CleverFormComponent from './components/clever-form/src/components/CleverForm/index.vue'
import CleverPopupComponent from './components/clever-popup/index.vue'
import CleverTableComponent from './components/clever-table/index.vue'

// 组件列表
const componentList = [
  CleverFormComponent,
  CleverPopupComponent,
  CleverTableComponent
]

// 安装函数
const install = (app: App) => {
  componentList.forEach(component => {
    if (component.install) {
      app.use(component)
    } else if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
const CleverComponent = {
  install,
  version: '0.1.0'
}

export default CleverComponent

// 支持按需引入
export { install }

// 类型导出
export type * from './types'
