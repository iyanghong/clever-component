<template>
  <div class="layout-demo">
    <n-space vertical size="large">
      <!-- 示例说明 -->
      <n-alert type="info" title="布局容器示例">
        演示 CleverForm 的各种布局容器，包括网格布局、弹性布局、标签页布局和折叠面板布局。
      </n-alert>

      <!-- 布局选择 -->
      <n-card title="布局类型选择">
        <n-radio-group v-model:value="currentLayout" name="layout-type">
          <n-space>
            <n-radio value="grid">网格布局</n-radio>
            <n-radio value="flex">弹性布局</n-radio>
            <n-radio value="tabs">标签页布局</n-radio>
            <n-radio value="collapse">折叠面板布局</n-radio>
          </n-space>
        </n-radio-group>
      </n-card>

      <!-- 表单示例 -->
      <n-card :title="layoutTitles[currentLayout]">
        <CleverForm
          v-model="formData"
          :config="currentFormConfig"
          @submit="handleSubmit"
        />
      </n-card>

      <!-- 配置展示 -->
      <n-card title="当前布局配置">
        <n-code :code="JSON.stringify(currentFormConfig.layout, null, 2)" language="json" />
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
  useMessage
} from 'naive-ui'
import { CleverForm } from "@clever-component/components";
import type { FormConfig, FormData } from '@clever-component/components'

const message = useMessage()

// 当前布局类型
const currentLayout = ref<'grid' | 'flex' | 'tabs' | 'collapse'>('grid')

// 布局标题
const layoutTitles = {
  grid: '网格布局表单',
  flex: '弹性布局表单',
  tabs: '标签页布局表单',
  collapse: '折叠面板布局表单'
}

// 表单数据
const formData = ref<FormData>({
  // 基本信息
  name: '',
  email: '',
  phone: '',
  gender: '',
  
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
  avatar: null
})

// 基础字段配置
const baseFields = [
  // 基本信息字段
  {
    field: 'name',
    label: '姓名',
    component: 'input' as const,
    required: true,
    placeholder: '请输入姓名',
    props: { clearable: true }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input' as const,
    required: true,
    placeholder: '请输入邮箱',
    props: { type: 'email', clearable: true }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input' as const,
    placeholder: '请输入手机号',
    props: { clearable: true }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group' as const,
    props: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    }
  },
  
  // 地址信息字段
  {
    field: 'country',
    label: '国家',
    component: 'select' as const,
    props: {
      options: [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' },
        { label: '日本', value: 'japan' }
      ]
    }
  },
  {
    field: 'province',
    label: '省份',
    component: 'select' as const,
    props: {
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' }
      ]
    }
  },
  {
    field: 'city',
    label: '城市',
    component: 'input' as const,
    placeholder: '请输入城市'
  },
  {
    field: 'address',
    label: '详细地址',
    component: 'textarea' as const,
    placeholder: '请输入详细地址',
    props: { rows: 3 }
  },
  
  // 工作信息字段
  {
    field: 'company',
    label: '公司名称',
    component: 'input' as const,
    placeholder: '请输入公司名称'
  },
  {
    field: 'position',
    label: '职位',
    component: 'input' as const,
    placeholder: '请输入职位'
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'number-input' as const,
    placeholder: '请输入薪资',
    props: { min: 0, precision: 0 }
  },
  {
    field: 'experience',
    label: '工作经验',
    component: 'select' as const,
    props: {
      options: [
        { label: '1年以下', value: '0-1' },
        { label: '1-3年', value: '1-3' },
        { label: '3-5年', value: '3-5' },
        { label: '5年以上', value: '5+' }
      ]
    }
  },
  
  // 其他信息字段
  {
    field: 'hobbies',
    label: '兴趣爱好',
    component: 'checkbox-group' as const,
    props: {
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
        { label: '旅行', value: 'travel' }
      ]
    }
  },
  {
    field: 'description',
    label: '个人描述',
    component: 'textarea' as const,
    placeholder: '请简单介绍一下自己...',
    props: { rows: 4, maxlength: 500, showCount: true }
  }
]

// 网格布局配置
const gridLayoutConfig = {
  type: 'grid' as const,
  props: {
    cols: 3,
    xGap: 16,
    yGap: 16
  },
  children: baseFields.map(field => ({
    ...field,
    span: field.field === 'address' || field.field === 'description' ? 3 : 1
  }))
}

// 弹性布局配置
const flexLayoutConfig = {
  type: 'flex' as const,
  props: {
    direction: 'column',
    gap: 16
  },
  children: [
    {
      type: 'flex',
      props: { gap: 16 },
      children: baseFields.slice(0, 4)
    },
    {
      type: 'flex',
      props: { gap: 16 },
      children: baseFields.slice(4, 8)
    },
    {
      type: 'flex',
      props: { gap: 16 },
      children: baseFields.slice(8, 12)
    },
    {
      type: 'flex',
      props: { gap: 16, direction: 'column' },
      children: baseFields.slice(12)
    }
  ]
}

// 标签页布局配置
const tabsLayoutConfig = {
  type: 'tabs' as const,
  props: {
    type: 'line',
    animated: true
  },
  children: [
    {
      key: 'basic',
      label: '基本信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(0, 4)
    },
    {
      key: 'address',
      label: '地址信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(4, 8).map(field => ({
        ...field,
        span: field.field === 'address' ? 2 : 1
      }))
    },
    {
      key: 'work',
      label: '工作信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(8, 12)
    },
    {
      key: 'other',
      label: '其他信息',
      type: 'grid',
      props: { cols: 1, yGap: 16 },
      children: baseFields.slice(12)
    }
  ]
}

// 折叠面板布局配置
const collapseLayoutConfig = {
  type: 'collapse' as const,
  props: {
    accordion: false,
    defaultExpandedNames: ['basic']
  },
  children: [
    {
      key: 'basic',
      title: '基本信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(0, 4)
    },
    {
      key: 'address',
      title: '地址信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(4, 8).map(field => ({
        ...field,
        span: field.field === 'address' ? 2 : 1
      }))
    },
    {
      key: 'work',
      title: '工作信息',
      type: 'grid',
      props: { cols: 2, xGap: 16, yGap: 16 },
      children: baseFields.slice(8, 12)
    },
    {
      key: 'other',
      title: '其他信息',
      type: 'grid',
      props: { cols: 1, yGap: 16 },
      children: baseFields.slice(12)
    }
  ]
}

// 当前表单配置
const currentFormConfig = computed<FormConfig>(() => {
  const layoutConfigs = {
    grid: gridLayoutConfig,
    flex: flexLayoutConfig,
    tabs: tabsLayoutConfig,
    collapse: collapseLayoutConfig
  }

  return {
    id: `${currentLayout.value}-form`,
    title: layoutTitles[currentLayout.value],
    layout: layoutConfigs[currentLayout.value],
    options: {
      size: 'medium',
      labelPlacement: 'left',
      labelWidth: 100,
      showRequiredMark: true
    }
  }
})

// 处理表单提交
const handleSubmit = (data: FormData) => {
  console.log('表单提交:', data)
  message.success(`${layoutTitles[currentLayout.value]}提交成功！`)
}
</script>

<style scoped>
.layout-demo {
  padding: 20px;
}
</style>