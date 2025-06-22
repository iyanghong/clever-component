<template>
  <DemoContainer
    title="复杂布局"
    description="展示CleverForm的多种布局模式：Grid、Flex、Tabs、Accordion 和混合布局。"
    :code="demoCode"
  >
    <n-space vertical size="large">
      <!-- 布局模式选择 -->
      <n-card size="small">
        <template #header>
          <n-space align="center">
            <n-icon><LayoutIcon /></n-icon>
            <span>布局模式选择</span>
          </n-space>
        </template>
        <n-radio-group v-model:value="currentLayout" @update:value="handleLayoutChange">
          <n-space>
            <n-radio value="grid">Grid 布局</n-radio>
            <n-radio value="flex">Flex 布局</n-radio>
            <n-radio value="tabs">Tabs 布局</n-radio>
            <n-radio value="accordion">Accordion 布局</n-radio>
            <n-radio value="mixed">混合布局</n-radio>
          </n-space>
        </n-radio-group>
      </n-card>

      <!-- Grid 布局 -->
      <div v-show="currentLayout === 'grid'">
        <h3>Grid 布局（响应式网格）</h3>
        <CleverForm
          ref="gridFormRef"
          :schemas="gridSchemas"
          :data="layoutModel"
          layout-mode="grid"
          :layout-config="gridLayoutConfig"
          @submit="handleLayoutSubmit"
        />
      </div>

      <!-- Flex 布局 -->
      <div v-show="currentLayout === 'flex'">
        <h3>Flex 布局（弹性布局）</h3>
        <CleverForm
          ref="flexFormRef"
          :schemas="flexSchemas"
          :data="layoutModel"
          layout-mode="flex"
          :layout-config="flexLayoutConfig"
          @submit="handleLayoutSubmit"
        />
      </div>

      <!-- Tabs 布局 -->
      <div v-show="currentLayout === 'tabs'">
        <h3>Tabs 布局（标签页分组）</h3>
        <CleverForm
          ref="tabsFormRef"
          :schemas="tabsSchemas"
          :data="layoutModel"
          layout-mode="tabs"
          @submit="handleLayoutSubmit"
        />
      </div>

      <!-- Accordion 布局 -->
      <div v-show="currentLayout === 'accordion'">
        <h3>Accordion 布局（手风琴分组）</h3>
        <CleverForm
          ref="accordionFormRef"
          :schemas="accordionSchemas"
          :data="layoutModel"
          layout-mode="accordion"
          @submit="handleLayoutSubmit"
        />
      </div>

      <!-- 混合布局 -->
      <div v-show="currentLayout === 'mixed'">
        <h3>混合布局（Tabs + Grid + Accordion）</h3>
        <CleverForm
          ref="mixedFormRef"
          :schemas="mixedSchemas"
          :data="mixedLayoutModel"
          layout-mode="mixed"
          :layout-config="mixedLayoutConfig"
          @submit="handleMixedLayoutSubmit"
        />
      </div>
    </n-space>
    
    <template #actions>
      <n-space>
        <n-button type="primary" @click="submitCurrentForm">提交表单</n-button>
        <n-button @click="resetCurrentForm">重置表单</n-button>
        <n-button @click="exportCurrentConfig" secondary>导出配置</n-button>
      </n-space>
    </template>
    
    <template #result>
      <n-alert v-if="result" type="info">
        <pre>{{ result }}</pre>
      </n-alert>
    </template>
  </DemoContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { NSpace, NButton, NAlert, NCard, NRadioGroup, NRadio, NIcon } from 'naive-ui'
import { Grid as LayoutIcon } from '@vicons/ionicons5'
import { CleverForm } from '@clever-component'
import type { FormFieldSchema } from '@clever-component'
import DemoContainer from '../../components/DemoContainer.vue'
import { generateFormCode } from '../../utils/demo-utils'

// 表单引用
const gridFormRef = ref()
const flexFormRef = ref()
const tabsFormRef = ref()
const accordionFormRef = ref()
const mixedFormRef = ref()

// 当前布局模式
const currentLayout = ref('grid')

// 结果显示
const result = ref('')

// 基础数据模型
const layoutModel = reactive({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  age: 25,
  gender: 'male',
  city: 'beijing',
  address: '北京市朝阳区',
  company: '某某公司',
  position: '前端工程师',
  salary: 15000,
  description: '这是一个测试描述'
})

// 混合布局数据模型
const mixedLayoutModel = reactive({
  // 基本信息
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  gender: 'male',
  birthday: null,
  
  // 地址信息
  country: 'china',
  province: 'beijing',
  city: 'beijing',
  address: '朝阳区某某街道',
  zipCode: '100000',
  
  // 工作信息
  company: '某某科技公司',
  position: '前端工程师',
  department: '技术部',
  salary: 15000,
  workYears: 3,
  
  // 其他信息
  hobbies: ['reading', 'coding'],
  skills: ['Vue', 'React', 'TypeScript'],
  description: '这是一个混合布局的演示表单，展示了如何在一个表单中使用多种布局方式。'
})

// Grid 布局配置
const gridLayoutConfig = {
  grid: {
    cols: '1 s:2 m:3 l:4 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  }
}

// Flex 布局配置
const flexLayoutConfig = {
  flex: {
    wrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    itemFlex: '1 1 300px',
    itemMinWidth: '250px'
  }
}

// 混合布局配置
const mixedLayoutConfig = {
  grid: {
    cols: '1 s:2 m:3 l:4 xl:4 2xl:4',
    xGap: 16,
    yGap: 16,
    responsive: true
  },
  flex: {
    direction: 'row',
    wrap: 'wrap',
    gap: 16,
    justify: 'flex-start',
    align: 'flex-start'
  },
  tabs: {
    type: 'line',
    placement: 'top'
  },
  accordion: {
    accordion: true,
    defaultExpandedNames: ['basic-info'],
    arrowPlacement: 'left'
  }
}

// Grid 布局字段
const gridSchemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    rules: [{ required: true, message: '请输入姓名' }],
    layout: { span: 1 }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: '请输入邮箱' },
    rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }],
    layout: { span: 1 }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: { placeholder: '请输入手机号' },
    layout: { span: 1 }
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    componentProps: { placeholder: '请输入年龄', min: 1, max: 120 },
    layout: { span: 1 }
  },
  {
    field: 'gender',
    label: '性别',
    component: 'radio-group',
    componentProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    },
    layout: { span: 2 }
  },
  {
    field: 'description',
    label: '描述',
    component: 'textarea',
    componentProps: { placeholder: '请输入描述', rows: 3 },
    layout: { span: 4 }
  }
]

// Flex 布局字段
const flexSchemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    layout: { flex: '1 1 200px', minWidth: '180px' }
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: '请输入邮箱' },
    layout: { flex: '2 1 300px', minWidth: '250px' }
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: { placeholder: '请输入手机号' },
    layout: { flex: '1 1 200px', minWidth: '180px' }
  },
  {
    field: 'description',
    label: '描述',
    component: 'textarea',
    componentProps: { placeholder: '请输入描述', rows: 3 },
    layout: { flex: '1 1 100%', minWidth: '100%' }
  }
]

// Tabs 布局字段
const tabsSchemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    group: '基本信息'
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: '请输入邮箱' },
    group: '基本信息'
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: { placeholder: '请输入手机号' },
    group: '联系方式'
  },
  {
    field: 'address',
    label: '地址',
    component: 'input',
    componentProps: { placeholder: '请输入地址' },
    group: '联系方式'
  },
  {
    field: 'company',
    label: '公司',
    component: 'input',
    componentProps: { placeholder: '请输入公司' },
    group: '工作信息'
  },
  {
    field: 'position',
    label: '职位',
    component: 'input',
    componentProps: { placeholder: '请输入职位' },
    group: '工作信息'
  }
]

// Accordion 布局字段
const accordionSchemas: FormFieldSchema[] = [
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    group: '个人信息',
    order: 1
  },
  {
    field: 'age',
    label: '年龄',
    component: 'input-number',
    componentProps: { placeholder: '请输入年龄' },
    group: '个人信息',
    order: 2
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: '请输入邮箱' },
    group: '联系信息',
    order: 1
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: { placeholder: '请输入手机号' },
    group: '联系信息',
    order: 2
  },
  {
    field: 'salary',
    label: '薪资',
    component: 'input-number',
    componentProps: { placeholder: '请输入薪资' },
    group: '薪资信息',
    order: 1
  }
]

// 混合布局字段（复杂嵌套结构）
const mixedSchemas: FormFieldSchema[] = [
  // 这里需要根据实际的混合布局API来定义
  // 暂时使用简化版本
  {
    field: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    group: '基本信息'
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: '请输入邮箱' },
    group: '基本信息'
  },
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
    group: '地址信息'
  },
  {
    field: 'company',
    label: '公司名称',
    component: 'input',
    componentProps: { placeholder: '请输入公司名称' },
    group: '工作信息'
  }
]

// 生成演示代码
const demoCode = computed(() => {
  const currentSchemas = {
    grid: gridSchemas,
    flex: flexSchemas,
    tabs: tabsSchemas,
    accordion: accordionSchemas,
    mixed: mixedSchemas
  }[currentLayout.value]
  
  return generateFormCode({
    schemas: currentSchemas,
    model: currentLayout.value === 'mixed' ? mixedLayoutModel : layoutModel,
    title: `${currentLayout.value.toUpperCase()} 布局示例`,
    description: `展示 ${currentLayout.value} 布局模式的使用方法`
  })
})

// 事件处理
const handleLayoutSubmit = (data: any) => {
  result.value = `${currentLayout.value.toUpperCase()} 布局表单提交成功：\n${JSON.stringify(data, null, 2)}`
}

const handleMixedLayoutSubmit = (data: any) => {
  result.value = `混合布局表单提交成功：\n${JSON.stringify(data, null, 2)}`
}

const handleLayoutChange = () => {
  result.value = ''
}

// 表单操作方法
const submitCurrentForm = () => {
  const formRefs = {
    grid: gridFormRef,
    flex: flexFormRef,
    tabs: tabsFormRef,
    accordion: accordionFormRef,
    mixed: mixedFormRef
  }
  formRefs[currentLayout.value].value?.submit()
}

const resetCurrentForm = () => {
  const formRefs = {
    grid: gridFormRef,
    flex: flexFormRef,
    tabs: tabsFormRef,
    accordion: accordionFormRef,
    mixed: mixedFormRef
  }
  formRefs[currentLayout.value].value?.reset()
  result.value = ''
}

const exportCurrentConfig = () => {
  const currentSchemas = {
    grid: gridSchemas,
    flex: flexSchemas,
    tabs: tabsSchemas,
    accordion: accordionSchemas,
    mixed: mixedSchemas
  }[currentLayout.value]
  
  const config = {
    layoutMode: currentLayout.value,
    schemas: currentSchemas,
    layoutConfig: currentLayout.value === 'grid' ? gridLayoutConfig :
                  currentLayout.value === 'flex' ? flexLayoutConfig :
                  currentLayout.value === 'mixed' ? mixedLayoutConfig : undefined
  }
  
  result.value = `当前布局配置：\n${JSON.stringify(config, null, 2)}`
}
</script>

<style scoped>
pre {
  background-color: var(--n-color);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 300px;
  overflow: auto;
}

h3 {
  margin: 0 0 16px 0;
  color: var(--n-text-color);
  font-weight: 600;
}
</style>