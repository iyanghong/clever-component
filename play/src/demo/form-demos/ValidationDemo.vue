<template>
  <div class="validation-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="表单验证示例">
        演示 CleverForm 的各种验证功能，包括同步验证、异步验证、条件验证等。
      </n-alert>

      <!-- 验证配置 -->
      <n-card title="验证配置">
        <n-space>
          <n-checkbox v-model:checked="validationConfig.validateOnInput">
            输入时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.validateOnBlur">
            失焦时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.validateOnSubmit">
            提交时验证
          </n-checkbox>
          <n-checkbox v-model:checked="validationConfig.showErrorMessage">
            显示错误信息
          </n-checkbox>
        </n-space>
      </n-card>

      <!-- 表单示例 -->
      <n-card title="用户注册表单（带验证）">
        <CleverForm
          v-model="formData"
          :config="formConfig"
          @submit="handleSubmit"
          @validate="handleValidate"
        />
      </n-card>

      <!-- 验证结果展示 -->
      <n-card title="验证结果">
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
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  NSpace,
  NAlert,
  NCard,
  NCode,
  NCheckbox,
  NTag,
  NList,
  NListItem,
  NThing,
  NText,
  useMessage
} from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig, FormData, ValidationResult } from '@clever-component/components'

const message = useMessage()

// 验证配置
const validationConfig = reactive({
  validateOnInput: true,
  validateOnBlur: true,
  validateOnSubmit: true,
  showErrorMessage: true
})

// 表单数据
const formData = ref<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  age: null,
  website: '',
  agreement: false
})

// 验证结果
const validationErrors = ref<ValidationResult[]>([])
const isValid = computed(() => validationErrors.value.length === 0)

// 自定义验证函数
const validateUsername = async (value: string) => {
  if (!value) {
    return Promise.reject('请输入用户名')
  }
  if (value.length < 3) {
    return Promise.reject('用户名至少3个字符')
  }
  // 模拟异步验证（检查用户名是否已存在）
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === 'admin' || value === 'test') {
        reject('用户名已存在')
      } else {
        resolve(true)
      }
    }, 1000)
  })
}

const validateConfirmPassword = (value: string) => {
  if (!value) {
    return Promise.reject('请确认密码')
  }
  if (value !== formData.value.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 表单配置
const formConfig = computed<FormConfig>(() => ({
  id: 'validation-form',
  title: '用户注册',
  description: '请填写注册信息',
  layout: {
    type: 'grid',
    props: {
      cols: 2,
      xGap: 16,
      yGap: 16
    },
    children: [
      {
        field: 'username',
        label: '用户名',
        component: 'input',
        required: true,
        placeholder: '请输入用户名（不能是admin或test）',
        props: {
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请输入用户名'
          },
          {
            min: 3,
            max: 20,
            message: '用户名长度应在3-20个字符之间'
          },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '用户名只能包含字母、数字和下划线'
          },
          {
            asyncValidator: validateUsername,
            trigger: 'blur'
          }
        ]
      },
      {
        field: 'email',
        label: '邮箱',
        component: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        props: {
          type: 'email',
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请输入邮箱地址'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式'
          }
        ]
      },
      {
        field: 'password',
        label: '密码',
        component: 'input',
        required: true,
        placeholder: '请输入密码',
        props: {
          type: 'password',
          showPasswordOn: 'click',
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度应在6-20个字符之间'
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
            message: '密码必须包含大小写字母和数字'
          }
        ]
      },
      {
        field: 'confirmPassword',
        label: '确认密码',
        component: 'input',
        required: true,
        placeholder: '请再次输入密码',
        props: {
          type: 'password',
          showPasswordOn: 'click',
          clearable: true
        },
        rules: [
          {
            required: true,
            message: '请确认密码'
          },
          {
            validator: validateConfirmPassword,
            trigger: ['blur', 'password-input']
          }
        ]
      },
      {
        field: 'phone',
        label: '手机号',
        component: 'input',
        placeholder: '请输入手机号',
        props: {
          clearable: true
        },
        rules: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号格式'
          }
        ]
      },
      {
        field: 'age',
        label: '年龄',
        component: 'number-input',
        placeholder: '请输入年龄',
        props: {
          min: 18,
          max: 100,
          clearable: true
        },
        rules: [
          {
            type: 'number',
            min: 18,
            max: 100,
            message: '年龄应在18-100之间'
          }
        ]
      },
      {
        field: 'website',
        label: '个人网站',
        component: 'input',
        span: 2,
        placeholder: '请输入个人网站地址（可选）',
        props: {
          clearable: true
        },
        rules: [
          {
            type: 'url',
            message: '请输入正确的网站地址'
          }
        ]
      },
      {
        field: 'agreement',
        label: '用户协议',
        component: 'checkbox-group',
        span: 2,
        required: true,
        props: {
          options: [
            {
              label: '我已阅读并同意《用户协议》和《隐私政策》',
              value: true
            }
          ]
        },
        rules: [
          {
            required: true,
            message: '请同意用户协议'
          },
          {
            validator: (value: boolean[]) => {
              if (!value || !value.includes(true)) {
                return Promise.reject('请同意用户协议')
              }
              return Promise.resolve()
            }
          }
        ]
      }
    ]
  },
  validation: {
    validateOnInput: validationConfig.validateOnInput,
    validateOnBlur: validationConfig.validateOnBlur,
    validateOnSubmit: validationConfig.validateOnSubmit,
    showErrorMessage: validationConfig.showErrorMessage,
    stopOnFirstError: false
  },
  options: {
    size: 'medium',
    labelPlacement: 'left',
    labelWidth: 100,
    showRequiredMark: true
  }
}))

// 监听验证配置变化，重新生成表单配置
watch(validationConfig, () => {
  // 触发表单配置更新
}, { deep: true })

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
  message.success('注册成功！')
}

// 处理验证结果
const handleValidate = (results: ValidationResult[]) => {
  validationErrors.value = results.filter(result => !result.valid)
  console.log('验证结果:', results)
}
</script>

<style scoped>
.validation-demo {
  padding: 20px;
}
</style>