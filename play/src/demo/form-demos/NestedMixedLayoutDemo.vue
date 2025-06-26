<template>
  <div class="nested-mixed-layout-demo">
    <h2>混合布局嵌套功能演示</h2>
    <p>展示 CleverForm 组件的混合布局嵌套功能，最顶层套一层 Grid 布局</p>
    
    <div class="demo-section">
      <h3>嵌套混合布局表单</h3>
      <CleverForm
        ref="nestedFormRef"
        v-model="formModel"
        :schemas="nestedSchemas"
        :layout-mode="'mixed'"
        :layout-config="nestedLayoutConfig"
        :show-submit-button="true"
        :show-reset-button="true"
        submit-button-text="提交表单"
        reset-button-text="重置表单"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </div>
    
    <div v-if="result" class="result-section">
      <h3>表单结果</h3>
      <pre>{{ result }}</pre>
    </div>
    
    <div class="config-section">
      <h3>配置说明</h3>
      <div class="config-item">
        <h4>顶层Grid配置</h4>
        <pre>{{ JSON.stringify(nestedLayoutConfig.topLevelGrid, null, 2) }}</pre>
      </div>
      <div class="config-item">
        <h4>容器Grid配置</h4>
        <pre>{{ JSON.stringify(nestedLayoutConfig.grid, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CleverForm } from '@clever-component'
import type { FormSchema, LayoutConfig } from '@clever-component'

// 表单数据模型
const formModel = reactive({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  age: null,
  
  // 地址信息
  country: '',
  province: '',
  city: '',
  address: '',
  
  // 工作信息
  company: '',
  position: '',
  salary: null,
  experience: '',
  
  // 其他信息
  hobbies: [],
  description: '',
  avatar: '',
  status: 'active'
})

// 嵌套混合布局配置
const nestedLayoutConfig: LayoutConfig = {
  // 顶层Grid配置 - 控制整个表单的网格布局
  topLevelGrid: {
    cols: 24,
    xGap: 24,
    yGap: 24,
    responsive: 'screen'
  },
  // 内部Grid配置 - 控制容器内部的网格布局
  grid: {
    cols: 12,
    xGap: 16,
    yGap: 16,
    responsive: 'screen'
  },
  // Flex配置
  flex: {
    direction: 'row',
    wrap: 'wrap',
    gap: '16px',
    justify: 'flex-start',
    align: 'flex-start'
  },
  // Tabs配置
  tabs: {
    type: 'line',
    placement: 'top'
  },
  // Accordion配置
  accordion: {
    accordion: false,
    defaultExpandedNames: ['basic', 'contact'],
    arrowPlacement: 'left'
  }
}

// 嵌套混合布局Schema
const nestedSchemas: FormSchema[] = [
  // 第一行：基本信息卡片容器
  {
    type: 'card',
    title: '基本信息',
    giProps: { span: 12 },
    componentProps: {
      bordered: true,
      size: 'medium'
    },
    children: [
      {
        type: 'grid',
        componentProps: {
          cols: 2,
          xGap: 12,
          yGap: 12
        },
        children: [
          {
            field: 'name',
            label: '姓名',
            component: 'input',
            componentProps: { placeholder: '请输入姓名' },
            rules: [{ required: true, message: '请输入姓名' }],
            giProps: { span: 1 }
          },
          {
            field: 'email',
            label: '邮箱',
            component: 'input',
            componentProps: { placeholder: '请输入邮箱' },
            rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
            giProps: { span: 1 }
          },
          {
            field: 'phone',
            label: '手机号',
            component: 'input',
            componentProps: { placeholder: '请输入手机号' },
            rules: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }],
            giProps: { span: 1 }
          },
          {
            field: 'age',
            label: '年龄',
            component: 'input-number',
            componentProps: { placeholder: '请输入年龄', min: 1, max: 120 },
            giProps: { span: 1 }
          }
        ]
      }
    ]
  },
  
  // 第一行：联系方式Tabs容器
  {
    type: 'tabs',
    title: '联系方式',
    giProps: { span: 12 },
    componentProps: {
      type: 'card'
    },
    children: [
      {
        name: 'address',
        title: '地址信息',
        children: [
          {
            type: 'flex',
            componentProps: {
              direction: 'column',
              gap: '12px'
            },
            children: [
              {
                field: 'country',
                label: '国家',
                component: 'select',
                componentProps: {
                  placeholder: '请选择国家',
                  options: [
                    { label: '中国', value: 'china' },
                    { label: '美国', value: 'usa' },
                    { label: '日本', value: 'japan' }
                  ]
                },
                flex: '1'
              },
              {
                type: 'flex',
                componentProps: {
                  direction: 'row',
                  gap: '12px'
                },
                children: [
                  {
                    field: 'province',
                    label: '省份',
                    component: 'input',
                    componentProps: { placeholder: '请输入省份' },
                    flex: '1'
                  },
                  {
                    field: 'city',
                    label: '城市',
                    component: 'input',
                    componentProps: { placeholder: '请输入城市' },
                    flex: '1'
                  }
                ]
              },
              {
                field: 'address',
                label: '详细地址',
                component: 'input',
                componentProps: { 
                  placeholder: '请输入详细地址',
                  type: 'textarea',
                  rows: 3
                },
                flex: '1'
              }
            ]
          }
        ]
      },
      {
        name: 'other',
        title: '其他联系方式',
        children: [
          {
            field: 'avatar',
            label: '头像',
            component: 'input',
            componentProps: { placeholder: '请输入头像URL' }
          }
        ]
      }
    ]
  },
  
  // 第二行：工作信息手风琴容器
  {
    type: 'accordion',
    title: '工作信息',
    giProps: { span: 16 },
    componentProps: {
      accordion: false,
      defaultExpandedNames: ['work-basic', 'work-detail']
    },
    children: [
      {
        name: 'work-basic',
        title: '基本工作信息',
        children: [
          {
            type: 'grid',
            componentProps: {
              cols: 2,
              xGap: 16,
              yGap: 12
            },
            children: [
              {
                field: 'company',
                label: '公司名称',
                component: 'input',
                componentProps: { placeholder: '请输入公司名称' },
                giProps: { span: 1 }
              },
              {
                field: 'position',
                label: '职位',
                component: 'input',
                componentProps: { placeholder: '请输入职位' },
                giProps: { span: 1 }
              }
            ]
          }
        ]
      },
      {
        name: 'work-detail',
        title: '详细工作信息',
        children: [
          {
            field: 'salary',
            label: '薪资',
            component: 'input-number',
            componentProps: { 
              placeholder: '请输入薪资',
              min: 0,
              formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
            }
          },
          {
            field: 'experience',
            label: '工作经历',
            component: 'input',
            componentProps: {
              placeholder: '请输入工作经历',
              type: 'textarea',
              rows: 4
            }
          }
        ]
      }
    ]
  },
  
  // 第二行：其他信息
  {
    type: 'card',
    title: '其他信息',
    giProps: { span: 8 },
    componentProps: {
      bordered: true,
      size: 'medium'
    },
    children: [
      {
        field: 'hobbies',
        label: '兴趣爱好',
        component: 'select',
        componentProps: {
          placeholder: '请选择兴趣爱好',
          multiple: true,
          options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
            { label: '摄影', value: 'photography' }
          ]
        }
      },
      {
        field: 'status',
        label: '状态',
        component: 'radio-group',
        componentProps: {
          options: [
            { label: '活跃', value: 'active' },
            { label: '非活跃', value: 'inactive' }
          ]
        }
      },
      {
        field: 'description',
        label: '个人描述',
        component: 'input',
        componentProps: {
          placeholder: '请输入个人描述',
          type: 'textarea',
          rows: 3
        }
      }
    ]
  }
]

// 表单引用
const nestedFormRef = ref()

// 结果显示
const result = ref('')

// 事件处理
const handleSubmit = (data: any) => {
  result.value = `嵌套混合布局表单提交成功：\n${JSON.stringify(data, null, 2)}`
}

const handleReset = () => {
  result.value = '表单已重置'
}

// 表单操作方法
const submitForm = () => {
  nestedFormRef.value?.submit()
}

const resetForm = () => {
  nestedFormRef.value?.resetFields()
  result.value = ''
}

const exportConfig = () => {
  const config = {
    layoutMode: 'mixed',
    schemas: nestedSchemas,
    layoutConfig: nestedLayoutConfig
  }
  
  result.value = `嵌套混合布局配置：\n${JSON.stringify(config, null, 2)}`
}
</script>

<style scoped>
.nested-mixed-layout-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.result-section {
  margin-bottom: 32px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
}

.config-section {
  margin-bottom: 32px;
}

.config-item {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.config-item h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

pre {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 300px;
  overflow: auto;
  margin: 0;
  border: 1px solid #e0e0e0;
}

h2 {
  margin: 0 0 16px 0;
  color: #333;
  font-weight: 600;
}

h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-weight: 600;
  font-size: 18px;
}

p {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.6;
}
</style>