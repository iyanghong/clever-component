<template>
  <DemoContainer
    title="动态表单"
    description="展示CleverForm的动态表单功能，支持动态添加/删除字段、切换字段显示状态等。"
    :code="demoCode"
  >
    <n-space vertical>
      <!-- 动态操作按钮 -->
      <n-space>
        <n-button @click="addField" type="primary" secondary>
          <template #icon>
            <n-icon><AddIcon /></n-icon>
          </template>
          添加字段
        </n-button>
        <n-button @click="removeField" :disabled="schemas.length <= 1" type="error" secondary>
          <template #icon>
            <n-icon><RemoveIcon /></n-icon>
          </template>
          删除字段
        </n-button>
        <n-button @click="toggleFieldVisibility" type="warning" secondary>
          <template #icon>
            <n-icon><EyeIcon /></n-icon>
          </template>
          切换字段显示
        </n-button>
        <n-button @click="changeFieldType" type="info" secondary>
          <template #icon>
            <n-icon><SwapIcon /></n-icon>
          </template>
          切换字段类型
        </n-button>
      </n-space>
      
      <!-- 表单 -->
      <CleverForm
        ref="formRef"
        :schemas="schemas"
        :data="model"
        @submit="handleSubmit"
        @field-change="handleFieldChange"
      />
    </n-space>
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="submitForm">提交表单</n-button>
        <n-button @click="resetForm">重置表单</n-button>
        <n-button @click="exportSchema" secondary>导出Schema</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" type="info">
        <pre>{{ result }}</pre>
      </n-alert>
      
      <n-alert v-if="schemaResult" type="success" style="margin-top: 12px;">
        <div>当前Schema配置：</div>
        <pre>{{ schemaResult }}</pre>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { NSpace, NButton, NAlert, NIcon } from 'naive-ui'
import { Add as AddIcon, Remove as RemoveIcon, Eye as EyeIcon, SwapHorizontalOutline as SwapIcon } from '@vicons/ionicons5'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode, generateRandomId } from '../../utils/demo-utils'

// 表单引用
const formRef = ref()

// 结果显示
const result = ref('')
const schemaResult = ref('')

// 字段计数器
let fieldCounter = 3

// 表单数据模型
const model = reactive({
  field1: '',
  field2: ''
})

// 表单字段配置
const schemas = ref<FormFieldSchema[]>([
  {
    field: 'field1',
    label: '字段1',
    component: 'input',
    componentProps: {
      placeholder: '请输入字段1'
    }
  },
  {
    field: 'field2',
    label: '字段2',
    component: 'input',
    componentProps: {
      placeholder: '请输入字段2'
    }
  }
])

// 字段类型选项
const fieldTypes = [
  { component: 'input', label: '文本输入', props: { placeholder: '请输入文本' } },
  { component: 'input-number', label: '数字输入', props: { placeholder: '请输入数字' } },
  { component: 'textarea', label: '多行文本', props: { placeholder: '请输入多行文本', rows: 3 } },
  { component: 'select', label: '下拉选择', props: { 
    placeholder: '请选择选项',
    options: [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' }
    ]
  }},
  { component: 'date-picker', label: '日期选择', props: { placeholder: '请选择日期', type: 'date' } },
  { component: 'switch', label: '开关', props: {} }
]

// 生成演示代码
const demoCode = generateFormCode({
  schemas: schemas.value,
  model,
  title: '动态表单示例',
  description: '展示动态添加/删除字段的功能'
})

// 监听schemas变化，更新代码
watch(schemas, () => {
  // 这里可以实时更新代码展示
}, { deep: true })

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `动态表单提交成功：\n${JSON.stringify(data, null, 2)}`
}

const handleFieldChange = (field: string, value: any) => {
  console.log(`字段 ${field} 值改变为:`, value)
}

// 动态表单操作
const addField = () => {
  const fieldType = fieldTypes[Math.floor(Math.random() * fieldTypes.length)]
  const fieldName = `field${fieldCounter}`
  
  const newField: FormFieldSchema = {
    field: fieldName,
    label: `字段${fieldCounter}`,
    component: fieldType.component as any,
    componentProps: fieldType.props
  }
  
  schemas.value.push(newField)
  model[fieldName] = fieldType.component === 'switch' ? false : 
                    fieldType.component === 'input-number' ? null : ''
  fieldCounter++
}

const removeField = () => {
  if (schemas.value.length > 1) {
    const removedField = schemas.value.pop()
    if (removedField) {
      delete model[removedField.field]
    }
  }
}

const toggleFieldVisibility = () => {
  if (schemas.value.length > 0) {
    const firstField = schemas.value[0]
    firstField.hidden = !firstField.hidden
  }
}

const changeFieldType = () => {
  if (schemas.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * schemas.value.length)
    const field = schemas.value[randomIndex]
    const newType = fieldTypes[Math.floor(Math.random() * fieldTypes.length)]
    
    field.component = newType.component as any
    field.componentProps = newType.props
    
    // 重置字段值
    model[field.field] = newType.component === 'switch' ? false : 
                        newType.component === 'input-number' ? null : ''
  }
}

// 表单操作方法
const submitForm = () => {
  formRef.value?.submit()
}

const resetForm = () => {
  formRef.value?.reset()
  result.value = ''
}

const exportSchema = () => {
  schemaResult.value = JSON.stringify(schemas.value, null, 2)
}
</script>

<style scoped>
pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow: auto;
}
</style>