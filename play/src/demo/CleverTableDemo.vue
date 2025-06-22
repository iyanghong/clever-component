<template>
  <div class="clever-table-demo">
    <n-card title="CleverTable 演示" class="demo-card">
      <n-space vertical size="large">
        <!-- Demo 导航 -->
        <n-card title="演示导航" size="small">
          <n-space>
            <n-button 
              v-for="demo in demos" 
              :key="demo.key"
              :type="currentDemo === demo.key ? 'primary' : 'default'"
              @click="currentDemo = demo.key"
            >
              {{ demo.title }}
            </n-button>
          </n-space>
        </n-card>

        <!-- Demo 内容 -->
        <DemoSection
          :title="currentDemoConfig.title"
          :description="currentDemoConfig.description"
        >
          <component :is="currentDemoConfig.component" />
        </DemoSection>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NSpace, NCard, NButton } from 'naive-ui'
import DemoSection from '../components/DemoSection.vue'
import BasicTableDemo from './table-demos/BasicTableDemo.vue'
import CrudTableDemo from './table-demos/CrudTableDemo.vue'
import AdvancedTableDemo from './table-demos/AdvancedTableDemo.vue'

// 当前演示
const currentDemo = ref('basic')

// 演示配置
const demos = [
  {
    key: 'basic',
    title: '基础表格',
    description: '展示表格的基础功能，包括数据展示、排序、筛选等',
    component: BasicTableDemo
  },
  {
    key: 'crud',
    title: 'CRUD操作',
    description: '展示表格的增删改查功能，包括行内编辑、批量操作等',
    component: CrudTableDemo
  },
  {
    key: 'advanced',
    title: '高级功能',
    description: '展示表格的高级功能，包括固定列、展开行、自定义渲染、虚拟滚动等',
    component: AdvancedTableDemo
  }
]

// 当前演示配置
const currentDemoConfig = computed(() => {
  return demos.find(demo => demo.key === currentDemo.value) || demos[0]
})
</script>

<style scoped>
.clever-table-demo {
  max-width: 100%;
}
</style>