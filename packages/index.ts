import type { App } from 'vue'

// 导入所有组件
import * as components from './components'
import CleverForm from './components/clever-form/index.vue'
import CleverPopup from './components/clever-popup/index.vue'
import CleverTable from './components/clever-table/index.vue'

// 导入工具函数和组合式函数
export * from './components'
export * from './composables'
export * from './utils'

// 导出具体组件
export {
  CleverForm,
  CleverPopup,
  CleverTable
}

// 导出类型
export type { CleverFormProps, FormSchema, CleverFormMethods, UseFormReturnType } from './components/clever-form/src/types/form'
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

// 组件列表
const componentList = [
  ...Object.values(components),
  CleverForm,
  CleverPopup,
  CleverTable
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
