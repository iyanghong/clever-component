<template>
  <div class="basic-usage-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="基础用法示例">
        演示 CleverForm 的基本功能，包括表单数据绑定、字段配置、验证规则等。
      </n-alert>

      <!-- Demo类型选择 -->
      <n-card title="Demo类型">
        <n-radio-group v-model:value="currentDemo" name="demo-type">
          <n-space>
            <n-radio value="basic">基础表单</n-radio>
            <n-radio value="nested">嵌套布局</n-radio>
            <n-radio value="validation">表单验证</n-radio>
          </n-space>
        </n-radio-group>
      </n-card>

      <!-- 表单示例 -->
      <n-card :title="demoTitles[currentDemo]">
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @submit="handleSubmit"
          @validate="handleValidate"
        />
      </n-card>

      <!-- 验证结果展示 -->
      <n-card v-if="currentDemo === 'validation'" title="验证结果">
        <n-space vertical>
          <div>
            <strong>表单状态：</strong>
            <n-tag :type="isValid ? 'success' : 'error'">
              {{ isValid ? '验证通过' : '验证失败' }}
            </n-tag>
          </div>
          <div v-if="validationErrors.length > 0">
            <strong>验证错误：</strong>
            <n-list>
              <n-list-item v-for="error in validationErrors" :key="error.field">
                <n-thing>
                  <template #header>
                    <n-text type="error">{{ error.field }}</n-text>
                  </template>
                  <n-text>{{ error.message }}</n-text>
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
        </n-space>
      </n-card>

      <!-- 表单数据展示 -->
      <n-card title="表单数据">
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </n-card>

      <!-- 配置展示 -->
      <n-card title="当前配置">
        <n-code :code="JSON.stringify(currentFormConfig, null, 2)" language="json" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NRadioGroup,
  NRadio,
  NTag,
  NList,
  NListItem,
  NThing,
  NText,
  useMessage
} from 'naive-ui'
import { CleverForm } from "@clever-component/components";
import type { FormConfig, FormData, ValidationResult } from '@clever-component/components'

const message = useMessage()

// 当前Demo类型
const currentDemo = ref<'basic' | 'nested' | 'validation'>('basic')

// Demo标题
const demoTitles = {
  basic: '基础表单示例',
  nested: '嵌套布局表单',
  validation: '表单验证示例'
}

// 验证状态
const isValid = ref(true)
const validationErrors = ref<Array<{ field: string; message: string }>>([])

// 表单数据
const formData = ref<FormData>({
  name: '',
  email: '',
  age: null,
  gender: '',
  hobbies: [],
  description: '',
  agree: false,
  // 嵌套布局数据
  address: {
    country: '',
    province: '',
    city: '',
    detail: ''
  },
  contact: {
    phone: '',
    wechat: '',
    qq: ''
  }
})

// 基础表单配置
const basicFormConfig: FormConfig = {
  layout: {
    type: 'grid',
    props: {
      cols: 2,
      rowGap: 16,
      colGap: 16
    },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入姓名',
        props: { clearable: true }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        props: { clearable: true }
      },
      {
        field: 'age',
        label: '年龄',
        component: 'input-number',
        placeholder: '请输入年龄',
        props: { min: 1, max: 120 }
      },
      {
        field: 'gender',
        label: '性别',
        component: 'radio-group',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      },
      {
        field: 'hobbies',
        label: '爱好',
        component: 'checkbox-group',
        options: [
          { label: '阅读', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' },
          { label: '旅行', value: 'travel' }
        ],
        props: { span: 2 }
      },
      {
        field: 'description',
        label: '个人描述',
        component: 'textarea',
        placeholder: '请输入个人描述',
        props: { rows: 4, span: 2 }
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showLabel: true,
    showActions: true,
    submitText: '提交',
    resetText: '重置'
  }
}

// 嵌套布局表单配置
const nestedFormConfig: FormConfig = {
  layout: {
    type: 'vertical',
    props: { gap: 24 },
    children: [
      {
        type: 'group',
        title: '基本信息',
        props: { collapsible: true, defaultExpanded: true },
        children: [
          {
            type: 'grid',
            props: { cols: 2, rowGap: 16, colGap: 16 },
            children: [
              {
                field: 'name',
                label: '姓名',
                component: 'input',
                required: true,
                placeholder: '请输入姓名',
                props: { clearable: true }
              },
              {
                field: 'email',
                label: '邮箱',
                component: 'input',
                required: true,
                placeholder: '请输入邮箱地址',
                props: { clearable: true }
              }
            ]
          }
        ]
      },
      {
        type: 'card',
        title: '地址信息',
        props: { bordered: true },
        children: [
          {
            type: 'grid',
            props: { cols: 3, rowGap: 16, colGap: 16 },
            children: [
              {
                field: 'address.country',
                label: '国家',
                component: 'select',
                options: [
                  { label: '中国', value: 'china' },
                  { label: '美国', value: 'usa' }
                ]
              },
              {
                field: 'address.province',
                label: '省份',
                component: 'input',
                placeholder: '请输入省份'
              },
              {
                field: 'address.city',
                label: '城市',
                component: 'input',
                placeholder: '请输入城市'
              },
              {
                field: 'address.detail',
                label: '详细地址',
                component: 'textarea',
                placeholder: '请输入详细地址',
                props: { span: 3, rows: 3 }
              }
            ]
          }
        ]
      },
      {
        type: 'tabs',
        props: {
          type: 'card',
          tabs: [
            {
              key: 'contact',
              label: '联系方式',
              children: [
                {
                  type: 'flex',
                  props: { direction: 'column', gap: 16 },
                  children: [
                    {
                      field: 'contact.phone',
                      label: '手机号',
                      component: 'input',
                      placeholder: '请输入手机号'
                    },
                    {
                      field: 'contact.wechat',
                      label: '微信号',
                      component: 'input',
                      placeholder: '请输入微信号'
                    },
                    {
                      field: 'contact.qq',
                      label: 'QQ号',
                      component: 'input',
                      placeholder: '请输入QQ号'
                    }
                  ]
                }
              ]
            }
          ]
        },
        children: []
      }
    ]
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showLabel: true,
    showActions: true,
    submitText: '提交',
    resetText: '重置'
  }
}

// 验证表单配置
const validationFormConfig: FormConfig = {
  layout: {
    type: 'grid',
    props: { cols: 2, rowGap: 16, colGap: 16 },
    children: [
      {
        field: 'name',
        label: '姓名',
        component: 'input',
        required: true,
        placeholder: '请输入姓名',
        props: { clearable: true },
        validation: {
          rules: [
            { required: true, message: '请输入姓名' },
            { min: 2, max: 20, message: '姓名长度应在2-20个字符之间' }
          ]
        }
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        props: { clearable: true },
        validation: {
          rules: [
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ]
        }
      },
      {
        field: 'age',
        label: '年龄',
        component: 'input-number',
        placeholder: '请输入年龄',
        props: { min: 1, max: 120 },
        validation: {
          rules: [
            { type: 'number', min: 18, max: 65, message: '年龄必须在18-65岁之间' }
          ]
        }
      },
      {
        field: 'gender',
        label: '性别',
        component: 'radio-group',
        required: true,
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ],
        validation: {
          rules: [
            { required: true, message: '请选择性别' }
          ]
        }
      },
      {
        field: 'agree',
        label: '',
        component: 'checkbox',
        text: '我同意相关条款和条件',
        required: true,
        props: { span: 2 },
        validation: {
          rules: [
            { required: true, message: '请同意相关条款和条件' }
          ]
        }
      }
    ]
  },
  validation: {
    validateOnInput: true,
    validateOnBlur: true,
    validateOnSubmit: true,
    showErrorMessage: true
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 80,
    showLabel: true,
    showActions: true,
    submitText: '提交',
    resetText: '重置'
  }
}

// 当前表单配置
const currentFormConfig = computed(() => {
  switch (currentDemo.value) {
    case 'basic':
      return basicFormConfig
    case 'nested':
      return nestedFormConfig
    case 'validation':
      return validationFormConfig
    default:
      return basicFormConfig
  }
})

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
  message.success('表单提交成功！')
}

// 处理表单验证
const handleValidate = (result: ValidationResult) => {
  isValid.value = result.valid
  validationErrors.value = result.errors || []
  console.log('验证结果:', result)
}
</script>

<style scoped>
.basic-usage-demo {
  padding: 20px;
}
</style>
