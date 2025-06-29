# FieldRenderer 重构说明

## 重构概述

基于 `clever-form1/FormField.vue` 的设计思路，对 `clever-form/FieldRenderer.vue` 进行了全面重构。

## 主要改进

### 1. 渲染方式优化

**重构前：**
- 使用动态组件 `<component :is="fieldComponent">` 方式
- 需要维护独立的字段组件文件（InputField.vue、SelectField.vue 等）
- 组件映射复杂，维护成本高

**重构后：**
- 采用条件模板渲染 `<template v-else-if>`
- 直接使用 Naive UI 原生组件
- 减少中间层，提高性能和可维护性

### 2. 组件支持扩展

新增支持的组件类型：
- ✅ NInput（默认输入框）
- ✅ NInputTextArea（文本域）
- ✅ NInputNumber（数字输入）
- ✅ NSelect（选择器）
- ✅ NRadioGroup（单选组）
- ✅ NCheckboxGroup（复选组）
- ✅ NDatePicker（日期选择）
- ✅ NTimePicker（时间选择）
- ✅ NSwitch（开关）
- ✅ NSlider（滑块）
- ✅ NRate（评分）
- ✅ NUpload（上传）

### 3. 插槽支持

- 支持自定义插槽渲染
- 提供完整的上下文数据（model、field、value、config）
- 兼容原有的插槽透传机制

### 4. 属性处理优化

```typescript
// 智能属性合并
const getComponentProps = (config: FieldConfig) => {
  const configProps = config.props || {}
  
  const baseProps = {
    placeholder: configProps.placeholder || `请输入${config.label}`,
    disabled: props.disabled || configProps.disabled || false,
    readonly: props.readonly || configProps.readonly || false,
    ...configProps
  }
  
  // 移除不需要传递给组件的属性
  const { options, ...componentProps } = baseProps
  return componentProps
}
```

### 5. 事件处理统一

```typescript
// 统一的值变化处理
const handleValueChange = (value: any) => {
  const oldValue = props.modelValue
  emit('update:modelValue', value)
  emit('change', value)
  
  // 支持配置回调
  if (props.config.events?.change) {
    props.config.events.change(value, oldValue)
  }
}
```

## 类型安全

### Props 接口

```typescript
interface Props {
  /** 字段配置 */
  config: FieldConfig
  /** 字段值 */
  modelValue?: any
  /** 表单数据模型（用于插槽） */
  formModel?: Record<string, any>
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
}
```

### Events 接口

```typescript
interface Emits {
  'update:modelValue': [value: any]
  change: [value: any]
  focus: []
  blur: []
  validate: [result: ValidationResult]
}
```

## 组件映射

```typescript
const componentMap: Record<string, string> = {
  'input': 'NInput',
  'textarea': 'NInputTextArea',
  'number': 'NInputNumber',
  'number-input': 'NInputNumber',
  'select': 'NSelect',
  'checkbox': 'NCheckboxGroup',
  'checkbox-group': 'NCheckboxGroup',
  'radio': 'NRadioGroup',
  'radio-group': 'NRadioGroup',
  'date': 'NDatePicker',
  'date-picker': 'NDatePicker',
  'time': 'NTimePicker',
  'time-picker': 'NTimePicker',
  'switch': 'NSwitch',
  'slider': 'NSlider',
  'rate': 'NRate',
  'upload': 'NUpload',
  'password': 'NInput',
  'search': 'NInput'
}
```

## 使用示例

```vue
<template>
  <FieldRenderer
    :config="fieldConfig"
    v-model="fieldValue"
    :form-model="formData"
    :disabled="isDisabled"
    @change="handleFieldChange"
  />
</template>

<script setup>
const fieldConfig = {
  field: 'username',
  label: '用户名',
  component: 'input',
  props: {
    placeholder: '请输入用户名',
    clearable: true
  }
}
</script>
```

## 兼容性

- ✅ 完全兼容现有的 FieldConfig 类型定义
- ✅ 保持原有的事件接口
- ✅ 支持所有 Naive UI 组件属性
- ✅ 向后兼容插槽机制

## 性能优化

1. **减少组件层级**：直接使用 Naive UI 组件，避免额外包装
2. **按需渲染**：只渲染匹配的组件类型
3. **属性优化**：智能合并和过滤组件属性
4. **事件优化**：统一事件处理，减少重复逻辑

## 测试

提供了完整的测试文件 `FieldRenderer.test.vue`，包含：
- 输入框测试
- 选择框测试
- 单选框测试
- 复选框测试
- 开关测试

## 后续计划

1. 添加更多组件类型支持
2. 完善验证机制集成
3. 优化性能和内存使用
4. 添加单元测试覆盖