// 全局类型定义

// 导入响应模型类型
import type { ResponseBaseModel, PageResponseModel, ListResponseModel, DetailResponseModel, OperationResponseModel } from './response'

// 声明全局类型
declare global {
  // 响应模型类型
  type ResponseBaseModel<T = any> = import('./response').ResponseBaseModel<T>
  type PageResponseModel<T = any> = import('./response').PageResponseModel<T>
  type ListResponseModel<T = any> = import('./response').ListResponseModel<T>
  type DetailResponseModel<T = any> = import('./response').DetailResponseModel<T>
  type OperationResponseModel = import('./response').OperationResponseModel
  
  // 基础数据类型
  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = Readonly<Record<string, T>>
  type Indexable<T = any> = {
    [key: string]: T
  }
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>
  
  // 函数类型
  type Fn<T = any, R = T> = (...arg: T[]) => R
  type PromiseFn<T = any, R = T> = (...arg: T[]) => Promise<R>
  
  // 组件类型
  type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null
  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>
  
  // 可空类型
  type Nullable<T> = T | null
  type NonNullable<T> = T extends null | undefined ? never : T
  type Undefinable<T> = T | undefined
  
  // 键值对类型
  type KeyValue<T = any> = {
    key: string
    value: T
  }
  
  // 选项类型
  type Option<T = any> = {
    label: string
    value: T
    disabled?: boolean
    [key: string]: any
  }
  
  // 树形数据类型
  type TreeOption<T = any> = Option<T> & {
    children?: TreeOption<T>[]
  }
  
  // 表单字段类型
  type FormField = {
    field: string
    label: string
    component: string
    componentProps?: Recordable
    rules?: any[]
    show?: boolean | ((values: Recordable) => boolean)
    required?: boolean
    defaultValue?: any
    helpMessage?: string
    labelWidth?: number | string
    colProps?: Recordable
    slot?: string
  }
  
  // 表格列类型
  type TableColumn = {
    key: string
    title: string
    dataIndex?: string
    width?: number | string
    fixed?: 'left' | 'right'
    align?: 'left' | 'center' | 'right'
    sorter?: boolean | Function
    filters?: any[]
    render?: Function
    customRender?: Function
    slots?: Recordable
    show?: boolean
    ifShow?: boolean | ((column: TableColumn) => boolean)
  }
  
  // 菜单类型
  type Menu = {
    id: string | number
    name: string
    path?: string
    icon?: string
    component?: string
    redirect?: string
    meta?: Recordable
    children?: Menu[]
    parentId?: string | number
    orderNo?: number
    roles?: string[]
    type?: number
    status?: number
  }
  
  // 用户信息类型
  type UserInfo = {
    id: string | number
    username: string
    nickname?: string
    avatar?: string
    email?: string
    phone?: string
    roles?: string[]
    permissions?: string[]
    [key: string]: any
  }
  
  // 分页参数类型
  type PageParams = {
    page?: number
    pageSize?: number
    total?: number
  }
  
  // 搜索参数类型
  type SearchParams = Recordable & PageParams
  
  // 上传文件类型
  type UploadFile = {
    uid: string
    name: string
    status?: 'uploading' | 'done' | 'error' | 'removed'
    response?: any
    url?: string
    type?: string
    size?: number
    originFileObj?: File
  }
  
  // 环境变量类型
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_BASE_API: string
    readonly VITE_APP_BASE_URL: string
    readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}