# CleverForm 配置化开发指南

本指南介绍如何使用 CleverForm 的配置化功能，获得更好的类型提示和开发体验。

## 🚀 快速开始

### 1. 使用配置构建器（推荐）

配置构建器提供了链式调用的 API，具有完整的 TypeScript 类型支持：

```typescript
import {
  createForm,
  createGrid,
  createFlex,
  input,
  select,
  radioGroup
} from '@clever-component/components/clever-form/src/utils/config-builder'

// 创建表单配置
const formConfig = createForm()
  .title('用户注册')
  .mode('create')
  .layout(
    createGrid().cols(2).rowGap(16).colGap(16).children([
      input('name', '姓名')
        .required()
        .placeholder('请输入姓名')
        .build(),
      
      input('email', '邮箱')
        .required()
        .placeholder('请输入邮箱地址')
        .addRule({ type: 'email', message: '请输入有效的邮箱地址' })
        .build(),
      
      radioGroup('gender', '性别')
        .options([
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ])
        .build()
    ])
  )
  .options({
    size: 'medium',
    labelPlacement: 'top'
  })
  .build()
```

### 2. 使用预设模板

我们提供了常用的表单模板，可以快速生成标准化配置：

```typescript
import { formTemplates } from '@clever-component/components/clever-form/src/templates'

// 用户注册表单
const userRegistrationForm = formTemplates.userRegistration().build()

// 员工信息表单
const employeeInfoForm = formTemplates.employeeInfo().build()

// 设置表单
const settingsForm = formTemplates.settings().build()

// 搜索表单
const searchForm = formTemplates.search().build()
```

### 3. JSON 配置（带类型提示）

对于 JSON 配置文件，我们提供了 JSON Schema 支持，在支持的编辑器中可以获得智能提示：

```json
{
  "$schema": "./packages/components/clever-form/src/types/schema.ts",
  "title": "用户注册表单",
  "mode": "create",
  "layout": {
    "type": "grid",
    "props": {
      "cols": 2,
      "rowGap": 16,
      "colGap": 16
    },
    "children": [
      {
        "field": "name",
        "label": "姓名",
        "component": "input",
        "required": true,
        "placeholder": "请输入姓名"
      },
      {
        "field": "email",
        "label": "邮箱",
        "component": "input",
        "required": true,
        "placeholder": "请输入邮箱地址",
        "rules": [
          {
            "type": "email",
            "message": "请输入有效的邮箱地址"
          }
        ]
      }
    ]
  }
}
```

## 📚 API 参考

### 字段构建器

#### 基础字段创建

```typescript
// 输入框
input(field: string, label: string)

// 文本域
textarea(field: string, label: string)

// 数字输入框
numberInput(field: string, label: string)

// 选择器
select(field: string, label: string)

// 单选组
radioGroup(field: string, label: string)

// 多选组
checkboxGroup(field: string, label: string)

// 日期选择器
datePicker(field: string, label: string)

// 开关
switchField(field: string, label: string)
```

#### 字段配置方法

```typescript
field
  .defaultValue(value: any)           // 设置默认值
  .placeholder(text: string)          // 设置占位符
  .help(text: string)                 // 设置帮助文本
  .required(required?: boolean)       // 设置必填
  .disabled(disabled?: boolean)       // 设置禁用
  .readonly(readonly?: boolean)       // 设置只读
  .show(condition: boolean | string)  // 设置显示条件
  .props(props: Record<string, any>)  // 设置组件属性
  .rules(rules: ValidationRule[])     // 设置验证规则
  .addRule(rule: ValidationRule)      // 添加验证规则
  .options(options: OptionItem[])     // 设置选项（选择类组件）
  .responsive(config: ResponsiveConfig) // 设置响应式配置
  .build()                            // 构建配置
```

### 布局构建器

#### 网格布局

```typescript
createGrid()
  .cols(cols: number | ResponsiveConfig)  // 设置列数
  .rowGap(gap: number | string)           // 设置行间距
  .colGap(gap: number | string)           // 设置列间距
  .itemProps(props: GridItemProps)        // 设置网格项属性
  .children([...])                        // 设置子项
  .build()
```

#### 弹性布局

```typescript
createFlex()
  .direction('row' | 'column')            // 设置主轴方向
  .justify('flex-start' | 'center' | ...) // 设置主轴对齐
  .align('flex-start' | 'center' | ...)   // 设置交叉轴对齐
  .wrap('nowrap' | 'wrap')                // 设置换行
  .gap(gap: number | string)              // 设置间距
  .children([...])                        // 设置子项
  .build()
```

#### 标签页布局

```typescript
createTabs()
  .type('line' | 'card' | 'bar')          // 设置标签页类型
  .placement('top' | 'left' | ...)        // 设置标签页位置
  .addTab(key, label, children)           // 添加标签页
  .build()
```

### 表单构建器

```typescript
createForm()
  .id(id: string)                         // 设置表单ID
  .title(title: string)                   // 设置表单标题
  .description(description: string)       // 设置表单描述
  .mode('create' | 'edit' | 'view')       // 设置表单模式
  .layout(layout: ContainerConfig)        // 设置表单布局
  .options(options: FormOptions)          // 设置表单选项
  .defaultData(data: FormData)            // 设置默认数据
  .build()
```

## 🎯 最佳实践

### 1. 使用构建器进行复杂配置

对于复杂的表单配置，推荐使用构建器方式，可以获得更好的类型安全和代码提示：

```typescript
// ✅ 推荐：使用构建器
const complexForm = createForm()
  .title('复杂表单')
  .layout(
    createTabs().type('card')
      .addTab('basic', '基本信息', [
        createGrid().cols(2).children([
          input('name', '姓名').required().build(),
          input('email', '邮箱').required().build()
        ])
      ])
      .addTab('advanced', '高级设置', [
        createFlex().direction('column').children([
          switchField('notifications', '启用通知').build(),
          select('theme', '主题').options([
            { label: '浅色', value: 'light' },
            { label: '深色', value: 'dark' }
          ]).build()
        ])
      ])
  )
  .build()
```

### 2. 使用模板进行快速开发

对于常见的表单场景，优先使用预设模板：

```typescript
// ✅ 推荐：使用模板快速创建
const userForm = formTemplates.userRegistration()
  .options({ size: 'large' })  // 可以在模板基础上进行定制
  .build()
```

### 3. 组合使用字段模板

可以组合使用字段模板来构建自定义表单：

```typescript
import { fieldTemplates } from '@clever-component/components/clever-form/src/templates'

const customForm = createForm()
  .layout(
    createGrid().cols(2).children([
      fieldTemplates.userInfo.name.build(),
      fieldTemplates.userInfo.email.build(),
      fieldTemplates.contact.phone.build(),
      fieldTemplates.address.province.build()
    ])
  )
  .build()
```

### 4. 条件显示和动态配置

```typescript
const dynamicForm = createForm()
  .layout(
    createGrid().cols(1).children([
      select('userType', '用户类型')
        .options([
          { label: '个人用户', value: 'personal' },
          { label: '企业用户', value: 'business' }
        ])
        .build(),
      
      // 条件显示字段
      input('companyName', '公司名称')
        .show('model.userType === "business"')  // 只有选择企业用户时才显示
        .required()
        .build(),
      
      input('personalId', '身份证号')
        .show('model.userType === "personal"')  // 只有选择个人用户时才显示
        .build()
    ])
  )
  .build()
```

## 🔧 VS Code 配置

为了获得更好的 JSON 配置体验，请确保项目根目录下的 `.vscode/settings.json` 包含以下配置：

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "**/form-config.json",
        "**/forms/*.json",
        "**/*form*.json"
      ],
      "url": "./packages/components/clever-form/src/types/schema.ts"
    }
  ]
}
```

## 📖 示例项目

查看 `play/src/demo/form-demos/ConfigBuilderDemo.vue` 文件，了解完整的使用示例。

## 🤝 贡献

如果你有新的模板需求或发现问题，欢迎提交 Issue 或 Pull Request。

## 📄 许可证

MIT License