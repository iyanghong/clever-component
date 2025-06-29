# CleverForm FormContext 空值检查修复

## 问题描述

在 `CleverFormItem.vue` 第 87 行出现运行时错误：
```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'value')
```

## 根本原因

`useFormContext()` 函数可能返回 `null`，但在多个组件中直接使用 `formContext` 而没有进行空值检查，导致当组件在没有表单上下文的环境中使用时出现错误。

## 修复方案

### 1. CleverFormItem.vue

**修复位置：**
- `validationStatus` 计算属性（第 87 行）
- `validationFeedback` 计算属性（第 95 行）
- `handleFieldChange` 函数（第 117 行）

**修复内容：**
```typescript
// 修复前
const validationStatus = computed(() => {
  const error = formContext.formErrors.value[props.config.field]
  // ...
})

// 修复后
const validationStatus = computed(() => {
  if (!formContext || !formContext.formErrors?.value) return undefined
  const error = formContext.formErrors.value[props.config.field]
  // ...
})
```

### 2. FieldRenderer.vue

**修复位置：**
- `fieldValue` 计算属性（第 218-219 行）

**修复内容：**
```typescript
// 修复前
const fieldValue = computed({
  get: () => formContext.getFieldValue(props.config.field),
  set: (value) => formContext.setFieldValue(props.config.field, value)
})

// 修复后
const fieldValue = computed({
  get: () => formContext?.getFieldValue?.(props.config.field),
  set: (value) => formContext?.setFieldValue?.(props.config.field, value)
})
```

### 3. form-engine/index.vue

**修复位置：**
- `handleFieldBlur` 函数
- `handleValidate` 函数
- `loadFormData` 函数
- `watch` 监听器
- `defineExpose` 暴露的方法
- `onMounted` 生命周期

**修复内容：**
```typescript
// 添加空值检查
if (!formContext) {
  console.warn('FormContext not available')
  return []
}

// 使用可选链操作符
formContext?.updateData(data)
formContext?.getFieldValue?.(field)
```

## 修复效果

1. **错误消除**：解决了 `Cannot read properties of undefined` 错误
2. **健壮性提升**：组件现在可以在没有表单上下文的环境中安全运行
3. **向后兼容**：不影响现有功能，只是增加了安全检查
4. **优雅降级**：当没有表单上下文时，组件会优雅地处理而不是崩溃

## 最佳实践

1. **始终检查注入的上下文**：使用 `inject` 获取的上下文可能为 `null`
2. **使用可选链操作符**：`?.` 操作符可以安全地访问可能为空的对象属性
3. **提供默认值**：在可能的情况下为空值提供合理的默认值
4. **添加警告日志**：在关键功能无法使用时记录警告信息

## 预防措施

1. 在所有使用 `inject` 的地方都要考虑返回值可能为 `null`
2. 在 TypeScript 中正确标注返回类型（如 `FormContext | null`）
3. 编写单元测试覆盖无上下文环境的场景
4. 在组件文档中说明对表单上下文的依赖关系