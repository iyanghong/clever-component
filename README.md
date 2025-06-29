# Clever Component

一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库

提供完整的数据管理解决方案，包含智能表单、弹窗容器和数据表格三大核心组件。

## ✨ 特性

### 🚀 核心技术
- **Vue 3 Composition API** - 基于最新的 Vue 3 和 Composition API
- **TypeScript 严格模式** - 完整的类型安全和智能提示
- **Vite 构建** - 极速的开发体验和构建性能
- **Naive UI 集成** - 深度集成 Naive UI 设计系统
- **现代化工具链** - ESLint + Prettier + Vitest 完整工具链

### 📦 组件特性
- **JSON Schema 驱动** - 通过单一配置实现复杂表单
- **容器化架构** - 支持多层级嵌套的灵活布局
- **API 集成** - 内置完整的 CRUD 操作能力
- **智能验证** - 基于 Naive UI 的完整验证体系
- **弹窗集成** - 无缝集成模态框和抽屉组件
- **高性能渲染** - 优化的渲染机制，支持大型表单

### 🛡️ 开发保障
- **类型安全** - 严格的 TypeScript 类型检查
- **单元测试** - 核心功能 70%+ 测试覆盖率
- **文档完整** - 详细的 API 文档和使用示例
- **调试友好** - 完善的错误提示和调试支持

## 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发

```bash
# 启动开发环境
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

### 构建

```bash
# 构建组件库
pnpm build

# 构建文档
pnpm docs:build
```

## 项目结构

```
clever-component/
├── .github/              # GitHub 配置
├── .vscode/             # VS Code 配置
├── docs/                # 文档网站
├── packages/            # 组件源码
│   ├── components/      # 组件实现
│   ├── composables/     # 组合式函数
│   ├── utils/          # 工具函数
│   └── index.ts        # 入口文件
├── play/               # 开发预览环境
├── scripts/            # 构建脚本
├── test/               # 测试配置
├── .eslintrc.cjs       # ESLint 配置
├── .prettierrc         # Prettier 配置
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 配置
└── vitest.config.ts    # Vitest 配置
```

## 🧩 核心组件

### CleverForm - 智能表单组件

基于 JSON Schema 驱动的高性能表单解决方案，采用容器化架构设计，提供完整的数据管理能力。

#### 🚀 核心特性
- **JSON Schema 驱动** - 通过单一 JSON 配置实现完整表单功能
- **容器化架构** - 支持 GridContainer、FlexContainer、TabsContainer、GroupContainer 等多种布局容器
- **API 集成** - 内置 CRUD 操作，支持完整的数据生命周期管理
- **Naive UI 验证** - 完全兼容 Naive UI 的 FormItemRule 验证体系
- **弹窗集成** - 与 CleverPopup 无缝集成，支持 Modal 和 Drawer 模式

#### 📦 丰富组件
- **基础字段** - Input、Number、Textarea、Switch 等基础输入组件
- **选择字段** - Select、Radio、Checkbox、Cascader 等选择类组件
- **日期时间** - DatePicker、TimePicker、DateTimePicker 等时间组件
- **高级字段** - Upload、Rate、Slider、ColorPicker 等高级组件

#### 🛠️ 高级功能
- **多层级嵌套** - 支持无限层级的容器嵌套（建议不超过 10 层）
- **条件显示** - 支持基于数据的动态显示和隐藏逻辑
- **字段联动** - 支持字段间的数据联动和事件处理
- **状态管理** - 独立的容器状态管理和数据隔离
- **类型安全** - 完整的 TypeScript 类型定义和检查
- **性能优化** - 支持 500+ 字段的大型表单渲染

### CleverPopup - 智能弹窗组件

统一的弹窗容器组件，支持Modal和Drawer两种模式。

#### 核心功能
- ✅ **双模式支持**：支持Modal和Drawer两种弹窗模式
- ✅ **灵活定位**：Drawer支持四个方向定位（top/right/bottom/left）
- ✅ **响应式宽度**：支持数字和字符串两种宽度设置
- ✅ **插槽支持**：支持默认内容和footer插槽

### CleverTable - 智能表格组件

基于NDataTable的增强表格组件，提供完整的CRUD功能。

#### 核心功能
- ✅ **数据表格**：基于NDataTable的增强表格组件
- ✅ **CRUD操作**：完整的增删改查功能支持
- ✅ **分页支持**：内置分页功能
- ✅ **搜索过滤**：集成搜索表单
- ✅ **列管理**：支持列的显示/隐藏设置

#### 高级功能
- ✅ **操作列**：自动生成操作列（编辑、删除等）
- ✅ **批量操作**：支持行选择和批量操作
- ✅ **自定义操作**：支持自定义操作按钮
- ✅ **表头操作**：支持表头自定义操作按钮
- ✅ **条件渲染**：支持基于数据的条件显示
- ✅ **API集成**：完整的API函数支持（获取列表、单条数据、增删改）

## 组件间协作

这三个组件形成了完整的数据管理解决方案：

- **CleverTable** 作为数据展示和管理的主体
- **CleverForm** 提供数据录入和编辑功能
- **CleverPopup** 为表单提供弹窗容器

通过组件间的深度集成，实现了从数据展示、搜索过滤、到数据编辑的完整业务流程。

## 使用方法

### 安装

```bash
npm install clever-component
```

### 引入

```typescript
// 完整引入
import { createApp } from 'vue'
import CleverComponent from 'clever-component'
import 'clever-component/dist/style.css'

const app = createApp(App)
app.use(CleverComponent)

// 按需引入
import { CleverForm, CleverPopup, CleverTable } from 'clever-component'
```

### 基础用法

```vue
<template>
  <div>
    <!-- 表格组件 -->
    <CleverTable
      :columns="columns"
      :api-config="apiConfig"
      :search-config="searchConfig"
      :actions="actions"
      :header-actions="headerActions"
    />
    
    <!-- 表单组件 -->
    <CleverForm
      :schemas="formSchemas"
      :is-popup="true"
      :popup-option="{ mode: 'modal', title: '编辑数据' }"
      v-model:visible-popup="formVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { CleverTable, CleverForm } from 'clever-component'

// 表格列配置
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'email', title: '邮箱' }
]

// API配置
const apiConfig = {
  listApi: (params) => api.getList(params),
  deleteApi: (id) => api.delete(id)
}

// 搜索配置
const searchConfig = {
  show: true,
  schemas: [
    { field: 'name', label: '姓名', component: 'NInput' }
  ]
}

// 操作配置
const actions = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    onClick: (record) => {
      // 打开编辑表单
    }
  }
]

// 表头操作
const headerActions = [
  {
    key: 'add',
    label: '新增',
    type: 'primary',
    onClick: () => {
      // 打开新增表单
    }
  }
]

// 表单配置
const formSchemas = [
  { field: 'name', label: '姓名', component: 'NInput', required: true },
  { field: 'age', label: '年龄', component: 'NInputNumber' },
  { field: 'email', label: '邮箱', component: 'NInput' }
]

const formVisible = ref(false)
</script>
```

## 开发指南

### 添加新组件

1. 在 `packages/components/` 目录下创建组件文件夹
2. 实现组件逻辑和样式
3. 添加类型定义
4. 编写单元测试
5. 更新导出文件

### 代码规范

- 使用 ESLint + Prettier 进行代码检查和格式化
- 遵循 Vue 3 Composition API 最佳实践
- 保持良好的 TypeScript 类型覆盖
- 编写完整的单元测试

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License