<template>
  <div class="field-renderer-test">
    <h2>FieldRenderer 测试页面</h2>
    
    <div class="test-section">
      <h3>输入框测试</h3>
      <FieldRenderer
        :config="inputConfig"
        v-model="inputValue"
      />
      <p>当前值: {{ inputValue }}</p>
    </div>

    <div class="test-section">
      <h3>选择框测试</h3>
      <FieldRenderer
        :config="selectConfig"
        v-model="selectValue"
      />
      <p>当前值: {{ selectValue }}</p>
    </div>

    <div class="test-section">
      <h3>单选框测试</h3>
      <FieldRenderer
        :config="radioConfig"
        v-model="radioValue"
      />
      <p>当前值: {{ radioValue }}</p>
    </div>

    <div class="test-section">
      <h3>复选框测试</h3>
      <FieldRenderer
        :config="checkboxConfig"
        v-model="checkboxValue"
      />
      <p>当前值: {{ checkboxValue }}</p>
    </div>

    <div class="test-section">
      <h3>开关测试</h3>
      <FieldRenderer
        :config="switchConfig"
        v-model="switchValue"
      />
      <p>当前值: {{ switchValue }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FieldRenderer from './FieldRenderer.vue'
import type { FieldConfig } from '../../types'

// 测试数据
const inputValue = ref('')
const selectValue = ref('')
const radioValue = ref('')
const checkboxValue = ref([])
const switchValue = ref(false)

// 配置对象
const inputConfig: FieldConfig = {
  field: 'input',
  label: '输入框',
  component: 'input',
  props: {
    placeholder: '请输入内容'
  }
}

const selectConfig: FieldConfig = {
  field: 'select',
  label: '选择框',
  component: 'select',
  props: {
    placeholder: '请选择',
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ]
  }
}

const radioConfig: FieldConfig = {
  field: 'radio',
  label: '单选框',
  component: 'radio-group',
  props: {
    options: [
      { label: '选项A', value: 'a' },
      { label: '选项B', value: 'b' },
      { label: '选项C', value: 'c' }
    ]
  }
}

const checkboxConfig: FieldConfig = {
  field: 'checkbox',
  label: '复选框',
  component: 'checkbox-group',
  props: {
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ]
  }
}

const switchConfig: FieldConfig = {
  field: 'switch',
  label: '开关',
  component: 'switch'
}
</script>

<style scoped>
.field-renderer-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.test-section h3 {
  margin-top: 0;
  color: #333;
}

.test-section p {
  margin-top: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-family: monospace;
}
</style>