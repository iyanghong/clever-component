# CleverForm 容器系统重构说明

## 重构目标

本次重构主要解决了容器组件中 `children` 配置的类型判断问题，使表单配置更加灵活和易用。

## 问题分析

### 原有问题

在原有的容器组件（GridContainer、FlexContainer、TabsContainer、CollapseContainer）中，判断子项是字段还是容器的逻辑不统一：

```typescript
// GridContainer 中的判断逻辑
item.type === 'field'  // 需要显式设置 type

// FlexContainer 中的判断逻辑
item.field  // 通过是否有 field 属性判断
```

这导致用户在配置表单时需要记住不同容器的不同规则，增加了使用复杂度。

### 配置示例

用户可能会这样配置表单：

```typescript
const formConfig = {
  type: 'container',
  containerType: 'grid',
  children: [
    {
      field: 'name',
      component: 'input',
      label: '姓名'
    },
    {
      field: 'age', 
      component: 'input-number',
      label: '年龄'
    },
    {
      type: 'container',
      containerType: 'flex',
      children: [
        {
          field: 'email',
          component: 'input',
          label: '邮箱'
        }
      ]
    }
  ]
}
```

注意到字段配置中没有显式的 `type: 'field'`，但容器配置有 `type: 'container'`。

## 解决方案

### 1. 创建 normalizeChildren 工具函数

在 `src/utils/index.ts` 中新增了 `normalizeChildren` 函数：

```typescript
/**
 * 规范化 children 配置，自动为字段项添加 type: 'field'
 * @param children 子配置数组
 * @returns 规范化后的配置数组
 */
export function normalizeChildren(children: any[]): any[] {
  return children.map(item => {
    // 如果已经有 type，直接返回
    if (item.type) {
      // 如果是容器，递归处理其 children
      if (item.type === 'container' && item.children) {
        return {
          ...item,
          children: normalizeChildren(item.children)
        }
      }
      return item
    }
    
    // 根据配置特征判断类型
    if (item.field && item.component) {
      // 字段配置：有 field 和 component 属性
      return {
        ...item,
        type: 'field'
      }
    } else if (item.children) {
      // 容器配置：有 children 属性
      return {
        ...item,
        type: 'container',
        children: normalizeChildren(item.children)
      }
    }
    
    // 默认当作字段处理
    return {
      ...item,
      type: 'field'
    }
  })
}
```

### 2. 更新容器组件

为所有容器组件添加了规范化逻辑：

#### GridContainer.vue
```typescript
// 添加计算属性
const normalizedChildren = computed(() => {
  return normalizeChildren(props.config.children || [])
})

// 模板中使用规范化后的配置
<template v-for="item in normalizedChildren" :key="item.field || item.key">
  <CleverFormItem v-if="item.type === 'field'" />
  <ContainerRenderer v-else />
</template>
```

#### FlexContainer.vue
```typescript
// 统一使用 type 判断逻辑
const normalizedChildren = computed(() => {
  return normalizeChildren(props.config.children || [])
})
```

#### TabsContainer.vue
```typescript
// 处理 tabs 结构
const normalizedTabs = computed(() => {
  return props.config.tabs?.map(tab => ({
    ...tab,
    children: normalizeChildren(tab.children || [])
  })) || []
})
```

#### CollapseContainer.vue
```typescript
// 处理 panels 结构
const normalizedPanels = computed(() => {
  return props.config.panels?.map(panel => ({
    ...panel,
    children: normalizeChildren(panel.children || [])
  })) || []
})
```

## 重构效果

### 1. 统一的判断逻辑

所有容器组件现在都使用统一的 `item.type === 'field'` 判断逻辑。

### 2. 更灵活的配置

用户可以：
- 不显式设置字段的 `type: 'field'`（会自动添加）
- 显式设置 `type: 'field'` 或 `type: 'container'`（会保持不变）
- 混合使用两种方式

### 3. 向后兼容

现有的表单配置无需修改，完全向后兼容。

### 4. 递归处理

支持嵌套容器的自动规范化，无论嵌套多少层都能正确处理。

## 使用示例

### 简化的配置方式

```typescript
const config = {
  type: 'container',
  containerType: 'grid',
  children: [
    // 不需要显式设置 type: 'field'
    {
      field: 'name',
      component: 'input',
      label: '姓名'
    },
    {
      field: 'age',
      component: 'input-number', 
      label: '年龄'
    }
  ]
}
```

### 混合配置方式

```typescript
const config = {
  type: 'container',
  containerType: 'tabs',
  tabs: [
    {
      key: 'basic',
      label: '基本信息',
      children: [
        // 自动识别为字段
        {
          field: 'name',
          component: 'input'
        },
        // 显式设置为容器
        {
          type: 'container',
          containerType: 'flex',
          children: [
            {
              field: 'email',
              component: 'input'
            }
          ]
        }
      ]
    }
  ]
}
```

## 总结

这次重构通过引入 `normalizeChildren` 工具函数，解决了容器组件中类型判断不统一的问题，使表单配置更加简洁和一致，同时保持了完全的向后兼容性。