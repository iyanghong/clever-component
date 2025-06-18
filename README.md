# Clever Component

一个基于 Vue 3 + Vite + TypeScript + Naive UI 的现代化组件库

提供完整的数据管理解决方案，包含智能表单、弹窗容器和数据表格三大核心组件。

## 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API
- ⚡ **Vite** - 极速的开发体验和构建性能
- 🔧 **TypeScript** - 完整的类型支持
- 🎨 **Naive UI** - 优雅的设计系统集成
- 📦 **组件化** - 高度可复用的组件设计
- 🧪 **测试** - 完整的单元测试覆盖
- 📚 **文档** - 详细的组件文档和示例

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

## 核心组件

### CleverForm - 智能表单组件

动态表单生成组件，支持32种不同的表单组件类型，提供完整的表单解决方案。

#### 核心功能
- ✅ **动态表单生成**：基于schema配置动态生成表单项
- ✅ **多种组件支持**：支持32种不同的表单组件类型（NInput、NSelect、NDatePicker等）
- ✅ **弹窗模式**：支持在弹窗中显示表单（modal/drawer）
- ✅ **响应式布局**：基于NGrid实现响应式网格布局
- ✅ **表单验证**：支持字段级验证规则配置

#### 高级功能
- ✅ **条件显示**：支持基于表单数据动态显示/隐藏字段
- ✅ **字段联动**：支持字段值变化时的回调处理
- ✅ **展开收起**：支持表单项的展开收起功能
- ✅ **自定义插槽**：支持自定义表单项渲染
- ✅ **标签提示**：支持字段标签的提示信息
- ✅ **多种显示模式**：支持编辑、详情、禁用三种显示模式

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