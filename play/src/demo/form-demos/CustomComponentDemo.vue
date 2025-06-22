<template>
  <div class="custom-component-demo">
    <h3>自定义组件</h3>
    <p>演示如何在 CleverForm 中集成自定义组件</p>
    
    <div class="demo-container">
      <CleverForm
        :schemas="formSchemas"
        :data="formData"
        @submit="handleSubmit"
      />
    </div>
    
    <div class="form-data">
      <h4>表单数据：</h4>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'

// 表单数据
const formData = ref({
  customInput: '',
  colorPicker: '#1890ff',
  rating: 3,
  tags: ['Vue', 'TypeScript']
})

// 演示说明：这里展示如何使用 CleverForm 的内置组件来实现各种表单控件
// 包括颜色选择、评分、多选标签等功能

// 表单配置
const formSchemas: FormFieldSchema[] = [
  {
    field: 'customInput',
    label: '自定义输入框',
    component: 'input',
    required: true,
    componentProps: {
      placeholder: '请输入内容...'
    }
  },
  {
    field: 'colorPicker',
    label: '颜色选择器',
    component: 'input',
    required: true,
    componentProps: {
      type: 'color',
      placeholder: '请选择颜色'
    }
  },
  {
    field: 'rating',
    label: '评分',
    component: 'input-number',
    required: true,
    componentProps: {
      min: 1,
      max: 5,
      placeholder: '请评分 (1-5)'
    }
  },
  {
    field: 'tags',
    label: '标签选择',
    component: 'select',
    required: true,
    componentProps: {
      multiple: true,
      placeholder: '请选择标签',
      options: [
        { label: 'Vue', value: 'Vue' },
        { label: 'React', value: 'React' },
        { label: 'Angular', value: 'Angular' },
        { label: 'TypeScript', value: 'TypeScript' },
        { label: 'JavaScript', value: 'JavaScript' },
        { label: 'Node.js', value: 'Node.js' }
      ]
    }
  }
]

// 提交处理
const handleSubmit = (data: any) => {
  console.log('提交数据:', data)
  alert('表单提交成功！')
}
</script>

<style scoped>
.custom-component-demo {
  padding: 20px;
}

.demo-container {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.form-data {
  margin-top: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.form-data pre {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 自定义输入框样式 */
.custom-input {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 4px 8px;
  background: white;
}

.custom-input:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.custom-input-field {
  flex: 1;
  border: none;
  outline: none;
  padding: 4px;
}

.custom-input-suffix {
  margin-left: 8px;
  color: #1890ff;
}

/* 颜色选择器样式 */
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 40px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  color: #666;
}

/* 评分组件样式 */
.rating {
  display: flex;
  gap: 4px;
}

.star {
  cursor: pointer;
  font-size: 20px;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.star.active {
  opacity: 1;
}

.star:hover {
  opacity: 0.8;
}

/* 标签选择器样式 */
.tag-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-tags,
.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag.selected {
  background: #1890ff;
  color: white;
}

.tag.selected:hover {
  background: #ff4d4f;
}

.tag.available {
  background: #f0f0f0;
  color: #666;
  border: 1px dashed #d9d9d9;
}

.tag.available:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}
</style>