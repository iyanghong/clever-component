<template>
  <div class="comprehensive-layout-demo">
    <n-card title="综合布局演示" class="demo-card">
      <!-- 布局类型选择 -->
      <div class="control-panel">
        <n-space>
          <n-select
            v-model:value="currentLayout"
            :options="layoutOptions"
            placeholder="选择布局类型"
            style="width: 200px"
          />
          <n-select
            v-model:value="currentDemo"
            :options="demoOptions"
            placeholder="选择演示类型"
            style="width: 200px"
          />
          <n-button @click="handleReset" type="primary" ghost>
            重置表单
          </n-button>
        </n-space>
      </div>

      <!-- 表单示例 -->
      <div class="form-example">
        <h3>{{ currentTitle }}</h3>
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @validate="handleValidate"
          @submit="handleSubmit"
        />
      </div>

      <!-- 验证结果 -->
      <div v-if="validationErrors.length > 0" class="validation-result">
        <h4>验证结果</h4>
        <n-alert type="error" :show-icon="false">
          <ul>
            <li v-for="error in validationErrors" :key="error.field">
              <strong>{{ error.field }}:</strong> {{ error.message }}
            </li>
          </ul>
        </n-alert>
      </div>

      <!-- 表单数据展示 -->
      <div class="form-data">
        <h4>表单数据</h4>
        <n-code :code="JSON.stringify(formData, null, 2)" language="json" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { NCard, NSpace, NSelect, NButton, NAlert, NCode } from 'naive-ui'
import { CleverForm } from '@clever-component/components'
import type { FormConfig } from '@clever-component/components'

// 当前选择的布局和演示类型
const currentLayout = ref('grid')
const currentDemo = ref('basic')

// 布局选项
const layoutOptions = [
  { label: '网格布局', value: 'grid' },
  { label: '弹性布局', value: 'flex' },
  { label: '标签页布局', value: 'tabs' },
  { label: '分组布局', value: 'group' },
  { label: '卡片布局', value: 'card' },
  { label: '折叠面板', value: 'collapse' },
  { label: '步骤布局', value: 'steps' },
  { label: '行内布局', value: 'inline' },
  { label: '垂直布局', value: 'vertical' }
]

// 演示类型选项
const demoOptions = [
  { label: '基础示例', value: 'basic' },
  { label: '嵌套布局', value: 'nested' },
  { label: '带验证', value: 'validation' }
]

// 验证状态
const isValid = ref(true)
const validationErrors = ref<Array<{ field: string; message: string }>>([])

// 表单数据
const formData = reactive({
  // 基础字段
  name: '',
  email: '',
  phone: '',
  gender: '',
  age: null,
  hobbies: [],
  description: '',
  agree: false,
  
  // 嵌套字段
  address: {
    province: '',
    city: '',
    district: '',
    detail: ''
  },
  education: {
    degree: '',
    school: '',
    major: '',
    graduationYear: null
  },
  
  // 步骤字段
  step1: {
    basicInfo: '',
    contact: ''
  },
  step2: {
    preferences: [],
    settings: ''
  },
  step3: {
    confirmation: false,
    notes: ''
  }
})

// 基础字段配置
const baseFields = [
  {
    field: 'name',
    label: '姓名',
    component: 'input' as const,
    placeholder: '请输入姓名'
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input' as const,
    placeholder: '请输入邮箱'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input' as const,
    placeholder: '请输入手机号'
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group' as const,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' }
    ]
  }
]

// 带验证的字段配置
const validationFields = baseFields.map(field => ({
  ...field,
  required: true,
  validation: {
    required: `${field.label}不能为空`,
    rules: field.field === 'email' ? [
      { type: 'email', message: '请输入有效的邮箱地址' }
    ] : field.field === 'phone' ? [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
    ] : []
  }
}))

// 网格布局配置
const gridConfigs = {
  basic: {
    id: 'grid-basic',
    title: '网格布局 - 基础示例',
    layout: {
      type: 'grid' as const,
      props: { cols: 2, rowGap: 16, colGap: 16 },
      children: baseFields
    }
  },
  nested: {
    id: 'grid-nested',
    title: '网格布局 - 嵌套示例',
    layout: {
      type: 'grid' as const,
      props: { cols: 1, rowGap: 16 },
      children: [
        {
          type: 'group' as const,
          title: '基本信息',
          props: { collapsible: true, defaultExpanded: true },
          children: {
            type: 'grid' as const,
            props: { cols: 2, rowGap: 12, colGap: 12 },
            children: baseFields.slice(0, 2)
          }
        },
        {
          type: 'group' as const,
          title: '联系方式',
          props: { collapsible: true, defaultExpanded: true },
          children: {
            type: 'grid' as const,
            props: { cols: 2, rowGap: 12, colGap: 12 },
            children: baseFields.slice(2)
          }
        }
      ]
    }
  },
  validation: {
    id: 'grid-validation',
    title: '网格布局 - 带验证',
    layout: {
      type: 'grid' as const,
      props: { cols: 2, rowGap: 16, colGap: 16 },
      children: validationFields
    }
  }
}

// 弹性布局配置
const flexConfigs = {
  basic: {
    id: 'flex-basic',
    title: '弹性布局 - 基础示例',
    layout: {
      type: 'flex' as const,
      props: { direction: 'column', gap: 16 },
      children: baseFields
    }
  },
  nested: {
    id: 'flex-nested',
    title: '弹性布局 - 嵌套示例',
    layout: {
      type: 'flex' as const,
      props: { direction: 'column', gap: 16 },
      children: [
        {
          type: 'flex' as const,
          props: { direction: 'row', gap: 16 },
          children: baseFields.slice(0, 2)
        },
        {
          type: 'flex' as const,
          props: { direction: 'row', gap: 16 },
          children: baseFields.slice(2)
        }
      ]
    }
  },
  validation: {
    id: 'flex-validation',
    title: '弹性布局 - 带验证',
    layout: {
      type: 'flex' as const,
      props: { direction: 'column', gap: 16 },
      children: validationFields
    }
  }
}

// 标签页布局配置
const tabsConfigs = {
  basic: {
    id: 'tabs-basic',
    title: '标签页布局 - 基础示例',
    layout: {
      type: 'tabs' as const,
      props: {
        type: 'line',
        placement: 'top',
        tabs: [
          {
            name: 'basic',
            label: '基本信息',
            children: baseFields.slice(0, 2)
          },
          {
            name: 'contact',
            label: '联系方式',
            children: baseFields.slice(2)
          }
        ]
      }
    }
  },
  nested: {
    id: 'tabs-nested',
    title: '标签页布局 - 嵌套示例',
    layout: {
      type: 'tabs' as const,
      props: {
        type: 'card',
        placement: 'top',
        tabs: [
          {
            name: 'info',
            label: '个人信息',
            children: {
              type: 'grid' as const,
              props: { cols: 2, rowGap: 12, colGap: 12 },
              children: baseFields
            }
          },
          {
            name: 'address',
            label: '地址信息',
            children: [
              {
                field: 'address.province',
                label: '省份',
                component: 'input' as const,
                placeholder: '请输入省份'
              },
              {
                field: 'address.city',
                label: '城市',
                component: 'input' as const,
                placeholder: '请输入城市'
              }
            ]
          }
        ]
      }
    }
  },
  validation: {
    id: 'tabs-validation',
    title: '标签页布局 - 带验证',
    layout: {
      type: 'tabs' as const,
      props: {
        type: 'line',
        placement: 'top',
        tabs: [
          {
            name: 'basic',
            label: '基本信息',
            children: validationFields.slice(0, 2)
          },
          {
            name: 'contact',
            label: '联系方式',
            children: validationFields.slice(2)
          }
        ]
      }
    }
  }
}

// 分组布局配置
const groupConfigs = {
  basic: {
    id: 'group-basic',
    title: '分组布局 - 基础示例',
    layout: {
      type: 'group' as const,
      props: {
        title: '用户信息',
        collapsible: true,
        defaultExpanded: true
      },
      children: baseFields
    }
  },
  nested: {
    id: 'group-nested',
    title: '分组布局 - 嵌套示例',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16 },
      children: [
        {
          type: 'group' as const,
          props: {
            title: '基本信息',
            collapsible: true,
            defaultExpanded: true
          },
          children: baseFields.slice(0, 2)
        },
        {
          type: 'group' as const,
          props: {
            title: '联系方式',
            collapsible: true,
            defaultExpanded: true
          },
          children: baseFields.slice(2)
        }
      ]
    }
  },
  validation: {
    id: 'group-validation',
    title: '分组布局 - 带验证',
    layout: {
      type: 'group' as const,
      props: {
        title: '用户信息（必填）',
        collapsible: true,
        defaultExpanded: true
      },
      children: validationFields
    }
  }
}

// 卡片布局配置
const cardConfigs = {
  basic: {
    id: 'card-basic',
    title: '卡片布局 - 基础示例',
    layout: {
      type: 'card' as const,
      props: {
        header: '用户信息卡片',
        bordered: true
      },
      children: baseFields
    }
  },
  nested: {
    id: 'card-nested',
    title: '卡片布局 - 嵌套示例',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16 },
      children: [
        {
          type: 'card' as const,
          props: {
            header: '基本信息',
            bordered: true
          },
          children: baseFields.slice(0, 2)
        },
        {
          type: 'card' as const,
          props: {
            header: '联系方式',
            bordered: true
          },
          children: baseFields.slice(2)
        }
      ]
    }
  },
  validation: {
    id: 'card-validation',
    title: '卡片布局 - 带验证',
    layout: {
      type: 'card' as const,
      props: {
        header: '用户信息（必填）',
        bordered: true
      },
      children: validationFields
    }
  }
}

// 折叠面板配置
const collapseConfigs = {
  basic: {
    id: 'collapse-basic',
    title: '折叠面板 - 基础示例',
    layout: {
      type: 'collapse' as const,
      props: {
        accordion: false,
        defaultExpandedNames: ['panel1'],
        panels: [
          {
            name: 'panel1',
            header: '用户信息',
            children: baseFields
          }
        ]
      }
    }
  },
  nested: {
    id: 'collapse-nested',
    title: '折叠面板 - 嵌套示例',
    layout: {
      type: 'collapse' as const,
      props: {
        accordion: false,
        defaultExpandedNames: ['basic', 'contact'],
        panels: [
          {
            name: 'basic',
            header: '基本信息',
            children: baseFields.slice(0, 2)
          },
          {
            name: 'contact',
            header: '联系方式',
            children: baseFields.slice(2)
          }
        ]
      }
    }
  },
  validation: {
    id: 'collapse-validation',
    title: '折叠面板 - 带验证',
    layout: {
      type: 'collapse' as const,
      props: {
        accordion: false,
        defaultExpandedNames: ['validation'],
        panels: [
          {
            name: 'validation',
            header: '用户信息（必填）',
            children: validationFields
          }
        ]
      }
    }
  }
}

// 步骤布局配置
const stepsConfigs = {
  basic: {
    id: 'steps-basic',
    title: '步骤布局 - 基础示例',
    layout: {
      type: 'steps' as const,
      props: {
        current: 0,
        direction: 'horizontal',
        steps: [
          {
            title: '基本信息',
            children: baseFields.slice(0, 2)
          },
          {
            title: '联系方式',
            children: baseFields.slice(2)
          }
        ]
      }
    }
  },
  nested: {
    id: 'steps-nested',
    title: '步骤布局 - 嵌套示例',
    layout: {
      type: 'steps' as const,
      props: {
        current: 0,
        direction: 'horizontal',
        steps: [
          {
            title: '第一步',
            children: {
              type: 'grid' as const,
              props: { cols: 2, rowGap: 12, colGap: 12 },
              children: baseFields.slice(0, 2)
            }
          },
          {
            title: '第二步',
            children: {
              type: 'vertical' as const,
              props: { gap: 12 },
              children: baseFields.slice(2)
            }
          }
        ]
      }
    }
  },
  validation: {
    id: 'steps-validation',
    title: '步骤布局 - 带验证',
    layout: {
      type: 'steps' as const,
      props: {
        current: 0,
        direction: 'horizontal',
        steps: [
          {
            title: '基本信息',
            children: validationFields.slice(0, 2)
          },
          {
            title: '联系方式',
            children: validationFields.slice(2)
          }
        ]
      }
    }
  }
}

// 行内布局配置
const inlineConfigs = {
  basic: {
    id: 'inline-basic',
    title: '行内布局 - 基础示例',
    layout: {
      type: 'inline' as const,
      props: { gap: 16, align: 'center' },
      children: baseFields.slice(0, 2)
    }
  },
  nested: {
    id: 'inline-nested',
    title: '行内布局 - 嵌套示例',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16 },
      children: [
        {
          type: 'inline' as const,
          props: { gap: 16, align: 'center' },
          children: baseFields.slice(0, 2)
        },
        {
          type: 'inline' as const,
          props: { gap: 16, align: 'center' },
          children: baseFields.slice(2)
        }
      ]
    }
  },
  validation: {
    id: 'inline-validation',
    title: '行内布局 - 带验证',
    layout: {
      type: 'inline' as const,
      props: { gap: 16, align: 'center' },
      children: validationFields.slice(0, 2)
    }
  }
}

// 垂直布局配置
const verticalConfigs = {
  basic: {
    id: 'vertical-basic',
    title: '垂直布局 - 基础示例',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16, align: 'stretch' },
      children: baseFields
    }
  },
  nested: {
    id: 'vertical-nested',
    title: '垂直布局 - 嵌套示例',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16 },
      children: [
        {
          type: 'group' as const,
          props: { title: '基本信息' },
          children: {
            type: 'vertical' as const,
            props: { gap: 12 },
            children: baseFields.slice(0, 2)
          }
        },
        {
          type: 'group' as const,
          props: { title: '联系方式' },
          children: {
            type: 'vertical' as const,
            props: { gap: 12 },
            children: baseFields.slice(2)
          }
        }
      ]
    }
  },
  validation: {
    id: 'vertical-validation',
    title: '垂直布局 - 带验证',
    layout: {
      type: 'vertical' as const,
      props: { gap: 16, align: 'stretch' },
      children: validationFields
    }
  }
}

// 所有配置
const allConfigs = {
  grid: gridConfigs,
  flex: flexConfigs,
  tabs: tabsConfigs,
  group: groupConfigs,
  card: cardConfigs,
  collapse: collapseConfigs,
  steps: stepsConfigs,
  inline: inlineConfigs,
  vertical: verticalConfigs
}

// 当前表单配置
const currentFormConfig = computed(() => {
  const layoutConfigs = allConfigs[currentLayout.value as keyof typeof allConfigs]
  return layoutConfigs[currentDemo.value as keyof typeof layoutConfigs] as FormConfig
})

// 当前标题
const currentTitle = computed(() => {
  return currentFormConfig.value?.title || '表单示例'
})

// 处理验证
const handleValidate = (valid: boolean, errors: any[]) => {
  isValid.value = valid
  validationErrors.value = errors || []
}

// 处理提交
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
}

// 重置表单
const handleReset = () => {
  Object.assign(formData, {
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: null,
    hobbies: [],
    description: '',
    agree: false,
    address: {
      province: '',
      city: '',
      district: '',
      detail: ''
    },
    education: {
      degree: '',
      school: '',
      major: '',
      graduationYear: null
    },
    step1: {
      basicInfo: '',
      contact: ''
    },
    step2: {
      preferences: [],
      settings: ''
    },
    step3: {
      confirmation: false,
      notes: ''
    }
  })
  isValid.value = true
  validationErrors.value = []
}
</script>

<style scoped>
.comprehensive-layout-demo {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.control-panel {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.form-example {
  margin-bottom: 20px;
}

.form-example h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.validation-result {
  margin-bottom: 20px;
}

.validation-result h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.validation-result ul {
  margin: 0;
  padding-left: 20px;
}

.validation-result li {
  margin-bottom: 4px;
}

.form-data {
  margin-top: 20px;
}

.form-data h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}
</style>