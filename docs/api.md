# API 文档

## CleverForm API

### Props

#### schemas
- **类型**: `FormSchema[]`
- **默认值**: `[]`
- **说明**: 表单配置项数组

#### modelValue
- **类型**: `Record<string, any>`
- **默认值**: `{}`
- **说明**: 表单数据，支持 v-model

#### isPopup
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否为弹窗模式

#### popupOption
- **类型**: `PopupOption`
- **默认值**: `{}`
- **说明**: 弹窗配置选项

#### visiblePopup
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 弹窗显示状态，支持 v-model:visible-popup

#### gridProps
- **类型**: `GridProps`
- **默认值**: `{ cols: 1, xGap: 16, yGap: 16 }`
- **说明**: 栅格布局配置

#### showActionButtonGroup
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否显示操作按钮组

#### submitButtonOptions
- **类型**: `ButtonOption`
- **默认值**: `{ text: '提交', type: 'primary' }`
- **说明**: 提交按钮配置

#### resetButtonOptions
- **类型**: `ButtonOption`
- **默认值**: `{ text: '重置' }`
- **说明**: 重置按钮配置

#### labelWidth
- **类型**: `number | string`
- **默认值**: `'auto'`
- **说明**: 标签宽度

#### labelAlign
- **类型**: `'left' | 'right'`
- **默认值**: `'right'`
- **说明**: 标签对齐方式

#### size
- **类型**: `'small' | 'medium' | 'large'`
- **默认值**: `'medium'`
- **说明**: 表单尺寸

#### disabled
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否禁用整个表单

#### readonly
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否只读模式

### Events

#### submit
- **参数**: `(values: Record<string, any>) => void`
- **说明**: 表单提交事件

#### reset
- **参数**: `() => void`
- **说明**: 表单重置事件

#### update:modelValue
- **参数**: `(values: Record<string, any>) => void`
- **说明**: 表单数据更新事件

#### update:visiblePopup
- **参数**: `(visible: boolean) => void`
- **说明**: 弹窗显示状态更新事件

#### field-change
- **参数**: `(field: string, value: any, values: Record<string, any>) => void`
- **说明**: 字段值变化事件

#### validate
- **参数**: `(errors: FormValidationError[] | undefined) => void`
- **说明**: 表单验证事件

### Methods

#### validate
- **参数**: `(callback?: (errors?: FormValidationError[]) => void) => Promise<boolean>`
- **说明**: 验证表单

#### validateField
- **参数**: `(field: string, callback?: (error?: FormValidationError) => void) => Promise<boolean>`
- **说明**: 验证指定字段

#### resetFields
- **参数**: `() => void`
- **说明**: 重置表单字段

#### clearValidate
- **参数**: `(fields?: string[]) => void`
- **说明**: 清除验证状态

#### setFormData
- **参数**: `(data: Record<string, any>) => void`
- **说明**: 设置表单数据

#### getFormData
- **参数**: `() => Record<string, any>`
- **说明**: 获取表单数据

#### setFieldValue
- **参数**: `(field: string, value: any) => void`
- **说明**: 设置字段值

#### getFieldValue
- **参数**: `(field: string) => any`
- **说明**: 获取字段值

#### setFieldsValue
- **参数**: `(values: Record<string, any>) => void`
- **说明**: 批量设置字段值

#### getFieldsValue
- **参数**: `(fields?: string[]) => Record<string, any>`
- **说明**: 批量获取字段值

### Slots

#### default
- **说明**: 默认插槽，用于自定义表单内容

#### action-button-group
- **说明**: 操作按钮组插槽

#### [field-name]
- **参数**: `{ field: string, value: any, setValue: (value: any) => void, formData: Record<string, any> }`
- **说明**: 字段自定义插槽

### Types

#### FormSchema
```typescript
interface FormSchema {
  field: string                    // 字段名
  label: string                    // 标签
  component: string                // 组件类型
  required?: boolean               // 是否必填
  defaultValue?: any               // 默认值
  componentProps?: Record<string, any>  // 组件属性
  rules?: FormItemRule[]           // 验证规则
  show?: boolean | ((values: Record<string, any>) => boolean)  // 显示条件
  disabled?: boolean | ((values: Record<string, any>) => boolean)  // 禁用条件
  gridItemProps?: GridItemProps    // 栅格项属性
  formItemProps?: FormItemProps    // 表单项属性
  helpText?: string                // 帮助文本
  slot?: string                    // 插槽名称
  labelWidth?: number | string     // 标签宽度
  labelAlign?: 'left' | 'right'    // 标签对齐
  showLabel?: boolean              // 是否显示标签
  showFeedback?: boolean           // 是否显示反馈
  validationStatus?: 'success' | 'warning' | 'error'  // 验证状态
  feedback?: string                // 反馈信息
}
```

#### PopupOption
```typescript
interface PopupOption {
  mode?: 'modal' | 'drawer'        // 弹窗模式
  title?: string                   // 标题
  width?: number | string          // 宽度
  height?: number | string         // 高度
  placement?: 'top' | 'right' | 'bottom' | 'left'  // Drawer 位置
  maskClosable?: boolean           // 点击遮罩是否关闭
  closable?: boolean               // 是否显示关闭按钮
  showFooter?: boolean             // 是否显示底部
  footerStyle?: CSSProperties      // 底部样式
  bodyStyle?: CSSProperties        // 内容样式
}
```

#### ButtonOption
```typescript
interface ButtonOption {
  text?: string                    // 按钮文本
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'  // 按钮类型
  size?: 'tiny' | 'small' | 'medium' | 'large'  // 按钮尺寸
  disabled?: boolean               // 是否禁用
  loading?: boolean                // 是否加载中
  ghost?: boolean                  // 是否幽灵按钮
  dashed?: boolean                 // 是否虚线边框
  round?: boolean                  // 是否圆角
  circle?: boolean                 // 是否圆形
  iconPlacement?: 'left' | 'right' // 图标位置
  icon?: () => VNode               // 图标
  onClick?: (e: MouseEvent) => void // 点击事件
}
```

## CleverTable API

### Props

#### columns
- **类型**: `TableColumn[]`
- **默认值**: `[]`
- **说明**: 表格列配置

#### data
- **类型**: `any[]`
- **默认值**: `[]`
- **说明**: 表格数据

#### loading
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 加载状态

#### autoLoad
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否自动加载数据

#### actions
- **类型**: `TableAction[]`
- **默认值**: `[]`
- **说明**: 行操作配置

#### headerActions
- **类型**: `HeaderAction[]`
- **默认值**: `[]`
- **说明**: 头部操作配置

#### searchConfig
- **类型**: `SearchConfig`
- **默认值**: `{}`
- **说明**: 搜索配置

#### apiConfig
- **类型**: `ApiConfig`
- **默认值**: `{}`
- **说明**: API 配置

#### paginationConfig
- **类型**: `PaginationConfig`
- **默认值**: `{ show: true, pageSize: 10 }`
- **说明**: 分页配置

#### actionColumnConfig
- **类型**: `ActionColumnConfig`
- **默认值**: `{ title: '操作', width: 150, fixed: 'right' }`
- **说明**: 操作列配置

#### indexColumnConfig
- **类型**: `IndexColumnConfig`
- **默认值**: `{ title: '序号', width: 80 }`
- **说明**: 序号列配置

#### selectionColumnConfig
- **类型**: `SelectionColumnConfig`
- **默认值**: `{ width: 50 }`
- **说明**: 选择列配置

#### showActionColumn
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否显示操作列

#### showIndexColumn
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否显示序号列

#### showSelectionColumn
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否显示选择列

#### checkedRowKeys
- **类型**: `(string | number)[]`
- **默认值**: `[]`
- **说明**: 选中的行键

#### rowKey
- **类型**: `string`
- **默认值**: `'id'`
- **说明**: 行键字段

#### size
- **类型**: `'small' | 'medium' | 'large'`
- **默认值**: `'medium'`
- **说明**: 表格尺寸

#### bordered
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否显示边框

#### striped
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否显示斑马纹

#### emptyText
- **类型**: `string`
- **默认值**: `'暂无数据'`
- **说明**: 空数据提示文本

#### maxHeight
- **类型**: `number | string`
- **默认值**: `undefined`
- **说明**: 最大高度

#### scrollX
- **类型**: `number | string`
- **默认值**: `undefined`
- **说明**: 横向滚动宽度

### Events

#### selection-change
- **参数**: `(keys: (string | number)[]) => void`
- **说明**: 选择变化事件

#### row-click
- **参数**: `(record: any, index: number) => void`
- **说明**: 行点击事件

#### row-dblclick
- **参数**: `(record: any, index: number) => void`
- **说明**: 行双击事件

#### load-data
- **参数**: `(data: any[]) => void`
- **说明**: 数据加载完成事件

#### before-load
- **参数**: `(params: any) => any`
- **说明**: 数据加载前事件

#### after-load
- **参数**: `(data: any[], response: any) => void`
- **说明**: 数据加载后事件

#### page-change
- **参数**: `(page: number) => void`
- **说明**: 页码变化事件

#### page-size-change
- **参数**: `(pageSize: number) => void`
- **说明**: 页面大小变化事件

#### search
- **参数**: `(params: Record<string, any>) => void`
- **说明**: 搜索事件

#### reset-search
- **参数**: `() => void`
- **说明**: 重置搜索事件

### Methods

#### handleRefresh
- **参数**: `() => void`
- **说明**: 刷新数据

#### handleOpenForm
- **参数**: `(record?: any) => void`
- **说明**: 打开表单

#### handleDelete
- **参数**: `(record: any) => void`
- **说明**: 删除数据

#### setCheckedRowKeys
- **参数**: `(keys: (string | number)[]) => void`
- **说明**: 设置选中行

#### getCheckedRowKeys
- **参数**: `() => (string | number)[]`
- **说明**: 获取选中行

#### updateSearchParams
- **参数**: `(params: Record<string, any>) => void`
- **说明**: 更新搜索参数

#### getTableData
- **参数**: `() => any[]`
- **说明**: 获取表格数据

#### setTableData
- **参数**: `(data: any[]) => void`
- **说明**: 设置表格数据

#### handleSearch
- **参数**: `(params?: Record<string, any>) => void`
- **说明**: 执行搜索

#### handleResetSearch
- **参数**: `() => void`
- **说明**: 重置搜索

#### toggleSearchCollapse
- **参数**: `() => void`
- **说明**: 切换搜索表单折叠状态

### Slots

#### header-actions
- **说明**: 头部操作区域插槽

#### search-form
- **说明**: 搜索表单插槽

#### empty
- **说明**: 空数据插槽

#### [column-key]
- **参数**: `{ record: any, index: number, column: TableColumn }`
- **说明**: 列自定义插槽

### Types

#### TableColumn
```typescript
interface TableColumn {
  key: string                      // 列键
  title: string                    // 列标题
  width?: number | string          // 列宽度
  minWidth?: number | string       // 最小宽度
  maxWidth?: number | string       // 最大宽度
  align?: 'left' | 'center' | 'right'  // 对齐方式
  fixed?: 'left' | 'right'         // 固定位置
  sortable?: boolean               // 是否可排序
  filterable?: boolean             // 是否可过滤
  resizable?: boolean              // 是否可调整大小
  ellipsis?: boolean               // 是否省略
  render?: (record: any, index: number) => VNode  // 自定义渲染
  renderHeader?: (column: TableColumn) => VNode   // 自定义头部渲染
  className?: string               // 列样式类名
  headerClassName?: string         // 头部样式类名
  show?: boolean | ((record: any) => boolean)     // 显示条件
}
```

#### TableAction
```typescript
interface TableAction {
  key: string                      // 操作键
  label: string                    // 操作标签
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'  // 按钮类型
  size?: 'tiny' | 'small' | 'medium' | 'large'  // 按钮尺寸
  icon?: () => VNode               // 图标
  disabled?: boolean | ((record: any) => boolean)  // 禁用条件
  show?: boolean | ((record: any) => boolean)      // 显示条件
  onClick: (record: any, index: number) => void    // 点击事件
  confirm?: ConfirmOption          // 确认对话框配置
}
```

#### HeaderAction
```typescript
interface HeaderAction {
  key: string                      // 操作键
  label: string                    // 操作标签
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'  // 按钮类型
  size?: 'tiny' | 'small' | 'medium' | 'large'  // 按钮尺寸
  icon?: () => VNode               // 图标
  disabled?: boolean | ComputedRef<boolean>        // 禁用状态
  show?: boolean | ComputedRef<boolean>            // 显示状态
  onClick: () => void              // 点击事件
}
```

#### SearchConfig
```typescript
interface SearchConfig {
  show?: boolean                   // 是否显示搜索
  collapsible?: boolean            // 是否可折叠
  collapsed?: boolean              // 默认折叠状态
  schemas: FormSchema[]            // 搜索表单配置
  gridProps?: GridProps            // 栅格布局配置
  submitText?: string              // 搜索按钮文本
  resetText?: string               // 重置按钮文本
  showSubmitButton?: boolean       // 是否显示搜索按钮
  showResetButton?: boolean        // 是否显示重置按钮
  showCollapseButton?: boolean     // 是否显示折叠按钮
}
```

#### ApiConfig
```typescript
interface ApiConfig<T extends Record<string, any> = any> {
  // 获取分页列表数据的API
  listApi?: GetPageApiFn<T>
  // 获取单条数据的API
  getApi?: GetApiFn<{ id: string | number }>
  // 新增数据的API
  createApi?: CreateApiFn<T>
  // 更新数据的API
  updateApi?: UpdateApiFn<T & { id: string | number }>
  // 删除数据的API
  deleteApi?: DeleteApiFn<{ id: string | number }>
  // 批量删除数据的API
  batchDeleteApi?: DeleteApiFn<{ ids: (string | number)[] }>
}
```

#### PaginationConfig
```typescript
interface PaginationConfig {
  show?: boolean                   // 是否显示分页
  page?: number                    // 当前页码
  pageSize?: number                // 页面大小
  pageSizes?: number[]             // 页面大小选项
  showSizePicker?: boolean         // 是否显示页面大小选择器
  showQuickJumper?: boolean        // 是否显示快速跳转
  simple?: boolean                 // 是否简单模式
  position?: 'left' | 'center' | 'right'  // 位置
}
```

### 表单组件类型

#### FormFieldSchema
```typescript
interface FormFieldSchema<T extends Record<string, any> = any> {
  field: keyof T | string          // 字段名
  label: string                    // 标签文本
  component: ComponentType         // 组件类型
  required?: boolean               // 是否必填
  rules?: Record<string, any>[]    // 验证规则
  componentProps?: Record<string, any>  // 组件属性
  ifShow?: (formModel: T, value: any, methods: CleverFormMethods<T>) => boolean  // 条件显示
  onChange?: (newValue: any, oldValue: any, methods: CleverFormMethods<T>) => void  // 值变化回调
  // ... 其他属性
}
```

#### FormGroupSchema
```typescript
interface FormGroupSchema<T extends Record<string, any> = any> {
  title: string                    // 分组标题
  collapsible?: boolean            // 是否可以收缩
  defaultExpanded?: boolean        // 是否默认展开分组
  columns?: number                 // 默认分多少列
  fields: FormFieldSchema<T>[]     // 分组内字段集合
  style?: Record<string, any>      // 分组样式
  className?: string               // 分组类名
  ifShow?: (formModel: T, methods: CleverFormMethods<T>) => boolean  // 条件显示
}
```

#### FormSchema
```typescript
type FormSchema<T extends Record<string, any> = any> = FormFieldSchema<T> | FormGroupSchema<T>
```

### 自定义ID字段

#### 表格组件
```typescript
interface CleverTableProps<T extends Record<string, any> = any> {
  // ... 其他属性
  idField?: string                 // 自定义ID字段名，默认为'id'
}
```

#### 表单组件
```typescript
interface CleverFormProps<T extends Record<string, any> = any> {
  // ... 其他属性
  idField?: string                 // 自定义ID字段名，默认为'id'
}
```

## CleverPopup API

### Props

#### visible
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 显示状态，支持 v-model

#### mode
- **类型**: `'modal' | 'drawer'`
- **默认值**: `'modal'`
- **说明**: 弹窗模式

#### title
- **类型**: `string`
- **默认值**: `''`
- **说明**: 标题

#### width
- **类型**: `number | string`
- **默认值**: `520`
- **说明**: 宽度

#### height
- **类型**: `number | string`
- **默认值**: `'auto'`
- **说明**: 高度

#### placement
- **类型**: `'top' | 'right' | 'bottom' | 'left'`
- **默认值**: `'right'`
- **说明**: Drawer 位置（仅 drawer 模式有效）

#### maskClosable
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 点击遮罩是否关闭

#### closable
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否显示关闭按钮

#### showFooter
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否显示底部

#### footerStyle
- **类型**: `CSSProperties`
- **默认值**: `{}`
- **说明**: 底部样式

#### bodyStyle
- **类型**: `CSSProperties`
- **默认值**: `{}`
- **说明**: 内容样式

#### headerStyle
- **类型**: `CSSProperties`
- **默认值**: `{}`
- **说明**: 头部样式

#### zIndex
- **类型**: `number`
- **默认值**: `undefined`
- **说明**: 层级

#### autoFocus
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否自动聚焦

#### trapFocus
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否锁定焦点

#### blockScroll
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否阻止滚动

### Events

#### update:visible
- **参数**: `(visible: boolean) => void`
- **说明**: 显示状态更新事件

#### close
- **参数**: `() => void`
- **说明**: 关闭事件

#### after-enter
- **参数**: `() => void`
- **说明**: 进入动画完成事件

#### after-leave
- **参数**: `() => void`
- **说明**: 离开动画完成事件

#### before-enter
- **参数**: `() => void`
- **说明**: 进入动画开始事件

#### before-leave
- **参数**: `() => void`
- **说明**: 离开动画开始事件

#### mask-click
- **参数**: `(e: MouseEvent) => void`
- **说明**: 遮罩点击事件

#### esc
- **参数**: `(e: KeyboardEvent) => void`
- **说明**: ESC 键事件

### Methods

#### open
- **参数**: `() => void`
- **说明**: 打开弹窗

#### close
- **参数**: `() => void`
- **说明**: 关闭弹窗

#### toggle
- **参数**: `() => void`
- **说明**: 切换显示状态

### Slots

#### default
- **说明**: 默认内容插槽

#### header
- **说明**: 头部内容插槽

#### footer
- **说明**: 底部内容插槽

#### close-icon
- **说明**: 关闭图标插槽

## 全局配置

### 主题配置

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'

const app = createApp(App)

// 配置主题
app.use(CleverComponent, {
  theme: {
    primaryColor: '#18a058',
    borderRadius: '6px',
    fontSize: '14px'
  }
})
```

### 国际化配置

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import zhCN from 'clever-component/locale/zh-CN'
import enUS from 'clever-component/locale/en-US'

const app = createApp(App)

// 配置语言
app.use(CleverComponent, {
  locale: zhCN // 或 enUS
})
```

### 默认配置

```typescript
import { createApp } from 'vue'
import CleverComponent from 'clever-component'

const app = createApp(App)

// 配置默认值
app.use(CleverComponent, {
  defaults: {
    form: {
      size: 'medium',
      labelWidth: 100,
      labelAlign: 'right'
    },
    table: {
      size: 'medium',
      bordered: true,
      striped: false,
      pageSize: 10
    },
    popup: {
      maskClosable: true,
      closable: true
    }
  }
})
```

## 类型定义

### 响应数据类型

```typescript
interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

interface PaginatedResponse<T = any> {
  code: number
  message: string
  data: {
    list: T[]
    total: number
    page?: number
    pageSize?: number
  }
}
```

### 表单验证类型

```typescript
interface FormValidationError {
  field: string
  message: string
  value: any
}

interface FormItemRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
  validator?: (rule: FormItemRule, value: any) => boolean | string | Promise<boolean | string>
  trigger?: 'blur' | 'change' | 'input'
}
```

### 确认对话框类型

```typescript
interface ConfirmOption {
  title?: string
  content?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  okText?: string
  cancelText?: string
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}
```

### 栅格布局类型

```typescript
interface GridProps {
  cols?: number | ResponsiveDescription
  xGap?: number | ResponsiveDescription
  yGap?: number | ResponsiveDescription
  collapsed?: boolean
  collapsedRows?: number
  responsive?: 'self' | 'screen'
  itemResponsive?: boolean
}

interface ResponsiveDescription {
  xs?: number
  s?: number
  m?: number
  l?: number
  xl?: number
  xxl?: number
}
```

---

更多详细信息请参考 [使用指南](./README.md) 和 [示例代码](../play/src/demo/)。