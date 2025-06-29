# CleverForm 智能表单组件

> 基于 Vue 3 + TypeScript + + Naive UI的高性能表单解决方案

## ✨ 特性

### 🚀 核心特性
- **JSON Schema 驱动**: 通过单一 JSON 配置实现完整表单功能
- **容器化架构**: 基于容器概念实现多层级嵌套的灵活布局系统
- **API 集成**: 内置完整的 CRUD 操作，支持数据生命周期管理
- **Naive UI 验证**: 完全兼容 Naive UI 的 FormItemRule 验证体系
- **高性能渲染**: 优化的渲染机制，支持 500+ 字段的大型表单
- **弹窗集成**: 与 CleverPopup 无缝集成，支持 Modal 和 Drawer 模式
- **类型安全**: 完整的 TypeScript 类型定义和严格模式检查
- **状态管理**: 独立的容器状态管理和数据隔离机制

### 📦 丰富组件

#### 🏗️ 容器化布局系统
- **GridContainer**: 网格布局容器，支持响应式栅格系统
- **FlexContainer**: 弹性布局容器，支持灵活的弹性布局
- **TabsContainer**: 标签页布局容器，支持分组展示
- **GroupContainer**: 分组布局容器，支持可折叠的分组显示

#### 📝 字段组件系统
- **基础字段**: Input、Number、Textarea、Switch 等基础输入组件
- **选择字段**: Select、Radio、Checkbox、Cascader 等选择类组件
- **日期时间**: DatePicker、TimePicker、DateTimePicker 等时间组件
- **高级字段**: Upload、Rate、Slider、ColorPicker 等高级组件

#### 🔧 核心引擎
- **ContainerEngine**: 容器化渲染引擎，处理嵌套结构
- **FieldRenderer**: 字段渲染器，处理数据绑定和验证
- **ValidationEngine**: 基于 Naive UI 的验证引擎
- **ApiManager**: API 操作管理器，处理 CRUD 数据流

### 🛡️ 开发保障
- **类型安全**: 严格的 TypeScript 类型检查和智能提示
- **Schema 验证**: 完整的 JSON Schema 合法性验证和错误提示
- **性能优化**: 支持 500+ 字段，首次渲染 < 200ms
- **测试覆盖**: 核心功能单元测试覆盖率 >= 70%
- **调试友好**: 详细的错误信息和开发工具支持
- **文档完整**: 完整的 API 文档和使用示例

## 📦 安装

```bash
# npm
npm install @clever-component/clever-form

# yarn
yarn add @clever-component/clever-form

# pnpm
pnpm add @clever-component/clever-form
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <CleverForm
    v-model="formData"
    :schema="formSchema"
    @submit="handleSubmit"
    @field-change="handleFieldChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CleverForm from '@clever-component/clever-form'
import type { FormSchema } from '@clever-component/clever-form'

// 表单数据
const formData = ref({})

// JSON Schema 配置
const formSchema: FormSchema = {
  containers: [
    {
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: [
        {
          field: 'name',
          label: '姓名',
          component: 'input',
          required: true,
          rules: [
            { required: true, message: '请输入姓名' },
            { min: 2, max: 20, message: '姓名长度为2-20个字符' }
          ],
          props: {
            placeholder: '请输入您的姓名'
          }
        },
        {
          field: 'email',
          label: '邮箱',
          component: 'input',
          required: true,
          rules: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ],
          props: {
            placeholder: '请输入邮箱地址'
          }
        },
        {
          field: 'age',
          label: '年龄',
          component: 'number-input',
          rules: [
            { type: 'number', min: 1, max: 120, message: '年龄必须在1-120之间' }
          ],
          props: {
            placeholder: '请输入年龄'
          }
        },
        {
          field: 'gender',
          label: '性别',
          component: 'radio-group',
          required: true,
          props: {
            options: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' }
            ]
          }
        }
      ]
    },
    {
      type: 'group',
      title: '其他信息',
      props: { collapsible: true },
      children: [
        {
          field: 'birthday',
          label: '生日',
          component: 'date-picker',
          props: {
            type: 'date',
            placeholder: '请选择生日'
          }
        },
        {
          field: 'interests',
          label: '兴趣爱好',
          component: 'checkbox-group',
          props: {
            options: [
              { label: '阅读', value: 'reading' },
              { label: '运动', value: 'sports' },
              { label: '音乐', value: 'music' },
              { label: '旅行', value: 'travel' }
            ]
          }
        },
        {
          field: 'agree',
          label: '同意条款',
          component: 'switch',
          required: true,
          rules: [
            { 
              validator: (value) => value === true,
              message: '请同意用户协议'
            }
          ]
        }
      ]
    }
  ]
}

// 事件处理
const handleSubmit = (data: any) => {
  console.log('表单提交数据:', data)
}

const handleFieldChange = (field: string, value: any) => {
  console.log(`字段 ${field} 值变更为:`, value)
}
</script>
```

### 多布局嵌套

```vue
<template>
  <CleverForm
    v-model="formData"
    :schemas="formSchemas"
    :layout="hybridLayoutConfig"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HybridLayoutConfig, FormSchema } from '@clever-component/clever-form'

const formData = ref({})

// 混合布局配置 - 支持多种布局嵌套
const hybridLayoutConfig: HybridLayoutConfig = {
  type: 'hybrid',
  layouts: [
    {
      id: 'basic-info',
      layout: {
        type: 'grid',
        props: { cols: 2, gap: 16 }
      },
      fields: ['name', 'email', 'phone'],
      condition: () => true
    },
    {
      id: 'address-info',
      layout: {
        type: 'vertical',
        props: { gap: 12 }
      },
      fields: ['province', 'city', 'address'],
      condition: (formData) => !!formData.name
    },
    {
      id: 'preferences',
      layout: {
        type: 'tabs',
        props: {
          tabs: [
            { key: 'personal', label: '个人偏好', fields: ['interests', 'hobbies'] },
            { key: 'work', label: '工作信息', fields: ['company', 'position'] }
          ]
        }
      },
      fields: ['interests', 'hobbies', 'company', 'position'],
      condition: (formData) => !!formData.email
    }
  ]
}

const formSchemas: FormSchema[] = [
  // ... 字段配置
]
</script>
```

### 弹窗模式

```vue
<template>
  <div>
    <NButton @click="showFormModal">打开表单弹窗</NButton>
    <NButton @click="showFormDrawer">打开表单抽屉</NButton>
    
    <CleverForm
      v-model="formData"
      :schemas="formSchemas"
      :popup="modalConfig"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
    
    <CleverForm
      v-model="formData"
      :schemas="formSchemas"
      :popup="drawerConfig"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
import type { PopupConfig } from '@clever-component/clever-form'

const formData = ref({})

// 模态框配置
const modalConfig: PopupConfig = {
  enabled: false,
  mode: 'modal',
  title: '用户信息表单',
  width: 600,
  closable: true,
  maskClosable: false
}

// 抽屉配置
const drawerConfig: PopupConfig = {
  enabled: false,
  mode: 'drawer',
  title: '编辑用户信息',
  width: 480,
  placement: 'right',
  closable: true
}

const showFormModal = () => {
  modalConfig.enabled = true
}

const showFormDrawer = () => {
  drawerConfig.enabled = true
}

const handleConfirm = () => {
  console.log('表单确认:', formData.value)
  modalConfig.enabled = false
  drawerConfig.enabled = false
}

const handleCancel = () => {
  console.log('表单取消')
  modalConfig.enabled = false
  drawerConfig.enabled = false
}
</script>
```

### 字段联动

```vue
<template>
  <CleverForm
    v-model="formData"
    :schemas="dynamicSchemas"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormSchema } from '@clever-component/clever-form'

const formData = ref({
  userType: '',
  company: '',
  position: '',
  school: '',
  major: ''
})

// 动态字段配置
const dynamicSchemas = computed((): FormSchema[] => {
  const baseSchemas: FormSchema[] = [
    {
      field: 'userType',
      label: '用户类型',
      component: 'select',
      required: true,
      props: {
        options: [
          { label: '企业用户', value: 'enterprise' },
          { label: '学生用户', value: 'student' }
        ]
      }
    }
  ]
  
  // 根据用户类型动态添加字段
  if (formData.value.userType === 'enterprise') {
    baseSchemas.push(
      {
        field: 'company',
        label: '公司名称',
        component: 'input',
        required: true,
        props: {
          placeholder: '请输入公司名称'
        }
      },
      {
        field: 'position',
        label: '职位',
        component: 'input',
        required: true,
        props: {
          placeholder: '请输入职位'
        }
      }
    )
  } else if (formData.value.userType === 'student') {
    baseSchemas.push(
      {
        field: 'school',
        label: '学校名称',
        component: 'input',
        required: true,
        props: {
          placeholder: '请输入学校名称'
        }
      },
      {
        field: 'major',
        label: '专业',
        component: 'input',
        required: true,
        props: {
          placeholder: '请输入专业'
        }
      }
    )
  }
  
  return baseSchemas
})
</script>
```

## 📚 API 文档

### CleverForm Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `Record<string, any>` | `{}` | 表单数据，支持 v-model |
| `schemas` | `FormSchema[]` | `[]` | 表单字段配置数组 |
| `layout` | `LayoutConfig` | - | 布局配置 |
| `popup` | `PopupConfig` | - | 弹窗配置 |
| `config` | `FormConfig` | - | 表单全局配置 |
| `disabled` | `boolean` | `false` | 是否禁用整个表单 |
| `readonly` | `boolean` | `false` | 是否只读模式 |

### CleverForm Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `(value: Record<string, any>)` | 表单数据更新 |
| `field-change` | `(field: string, value: any)` | 字段值变更 |
| `validate` | `(result: ValidationResult)` | 表单验证结果 |
| `submit` | `(data: Record<string, any>)` | 表单提交 |
| `reset` | `()` | 表单重置 |
| `confirm` | `()` | 弹窗确认（仅弹窗模式） |
| `cancel` | `()` | 弹窗取消（仅弹窗模式） |

### FormSchema 配置

```typescript
interface FormSchema {
  field: string                    // 字段名
  label?: string                   // 字段标签
  component: FieldComponentType    // 组件类型
  props?: Record<string, any>      // 组件属性
  rules?: ValidationRule[]         // 验证规则
  defaultValue?: any               // 默认值
  required?: boolean               // 是否必填
  disabled?: boolean               // 是否禁用
  readonly?: boolean               // 是否只读
  visible?: boolean | ((formData: Record<string, any>) => boolean) // 是否显示
  dependencies?: string[]          // 依赖字段
  linkage?: LinkageConfig          // 联动配置
  layout?: FieldLayoutConfig       // 字段布局配置
  help?: string                    // 帮助文本
  placeholder?: string             // 占位符
}
```

### LayoutConfig 配置

```typescript
interface LayoutConfig {
  type: 'grid' | 'flex' | 'inline' | 'vertical' | 'tabs' | 'accordion' | 'hybrid'
  props?: Record<string, any>
  children?: LayoutConfig[]
  groups?: LayoutGroup[]
}

// 混合布局配置
interface HybridLayoutConfig extends LayoutConfig {
  type: 'hybrid'
  layouts: {
    id: string
    layout: LayoutConfig
    fields: string[]
    condition?: (formData: Record<string, any>) => boolean
  }[]
}
```

### PopupConfig 配置

```typescript
interface PopupConfig {
  enabled: boolean                 // 是否启用弹窗
  title?: string                   // 弹窗标题
  width?: number | string          // 弹窗宽度
  mode?: 'modal' | 'drawer'        // 弹窗模式
  placement?: 'top' | 'right' | 'bottom' | 'left' // 抽屉位置
  closable?: boolean               // 是否显示关闭按钮
  maskClosable?: boolean           // 是否点击遮罩关闭
  className?: string               // 自定义样式类
  style?: Record<string, any>      // 自定义样式
}
```

## 🎨 支持的字段类型

### 输入类组件
- `input` - 文本输入框
- `number-input` - 数字输入框
- `textarea` - 文本域
- `password` - 密码输入框
- `search` - 搜索框

### 选择类组件
- `select` - 下拉选择
- `radio-group` - 单选框组
- `checkbox-group` - 复选框组
- `cascader` - 级联选择
- `transfer` - 穿梭框

### 日期时间类组件
- `date-picker` - 日期选择器
- `time-picker` - 时间选择器
- `datetime-picker` - 日期时间选择器
- `date-range-picker` - 日期范围选择器

### 其他组件
- `switch` - 开关
- `slider` - 滑块
- `rate` - 评分
- `color-picker` - 颜色选择器
- `upload` - 文件上传

## 🔧 高级用法

### 自定义字段组件

```typescript
// 注册自定义组件
import { registerFieldComponent } from '@clever-component/clever-form'
import CustomField from './CustomField.vue'

registerFieldComponent('custom-field', CustomField)

// 在 Schema 中使用
const schema: FormSchema = {
  field: 'customValue',
  label: '自定义字段',
  component: 'custom-field',
  props: {
    // 自定义属性
  }
}
```

### 自定义验证规则

```typescript
const schema: FormSchema = {
  field: 'username',
  label: '用户名',
  component: 'input',
  rules: [
    {
      validator: async (value: string) => {
        // 异步验证用户名是否存在
        const exists = await checkUsernameExists(value)
        return !exists
      },
      message: '用户名已存在'
    }
  ]
}
```

### 表单方法调用

```vue
<template>
  <CleverForm
    ref="formRef"
    v-model="formData"
    :schemas="schemas"
  />
  <NButton @click="validateForm">验证表单</NButton>
  <NButton @click="resetForm">重置表单</NButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const validateForm = async () => {
  const result = await formRef.value?.validate()
  console.log('验证结果:', result)
}

const resetForm = () => {
  formRef.value?.reset()
}
</script>
```

## 🔍 类型安全

CleverForm 提供完整的 TypeScript 类型支持：

```typescript
import type {
  FormSchema,
  LayoutConfig,
  PopupConfig,
  ValidationRule,
  FieldComponentType,
  FormConfig,
  ValidationResult
} from '@clever-component/clever-form'

// 类型安全的表单配置
const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input', // 自动类型提示
    required: true,
    rules: [
      { required: true, message: '请输入姓名' }
    ]
  }
]
```

## 🚀 性能优化

### 大型表单优化

```vue
<template>
  <CleverForm
    v-model="formData"
    :schemas="schemas"
    :config="{ virtualScroll: true }"
  />
</template>
```

### 按需加载

```typescript
// 只导入需要的组件
import { CleverForm, InputField, SelectField } from '@clever-component/clever-form'
```

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献

### 开发环境搭建

```bash
# 克隆项目
git clone https://github.com/your-org/clever-component.git

# 安装依赖
cd clever-component
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建项目
pnpm build
```

### 提交规范

我们使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```bash
# 功能开发
git commit -m "feat(form): add hybrid layout support"

# Bug 修复
git commit -m "fix(validation): resolve async validation issue"

# 文档更新
git commit -m "docs(readme): update API documentation"
```

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 致谢

感谢以下开源项目的启发和支持：

- [Vue 3](https://vuejs.org/)
- [Naive UI](https://www.naiveui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

如果这个项目对你有帮助，请给我们一个 ⭐️ Star！