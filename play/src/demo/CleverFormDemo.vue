<template>
  <div class="clever-form-demo">
    <n-card title="CleverForm 智能表单组件" class="demo-card">
      <n-tabs type="line" animated>
        <n-tab-pane name="basic" tab="基础用法">
          <BasicUsageDemo />
        </n-tab-pane>
        <n-tab-pane name="validation" tab="表单验证">
          <ValidationDemo />
        </n-tab-pane>
        <n-tab-pane name="layout" tab="布局容器">
          <LayoutDemo />
        </n-tab-pane>
        <n-tab-pane name="dynamic" tab="动态表单">
          <DynamicFormDemo />
        </n-tab-pane>
        <n-tab-pane name="popup" tab="弹窗表单">
          <PopupFormDemo />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane } from 'naive-ui'
import BasicUsageDemo from './form-demos/BasicUsageDemo.vue'
import ValidationDemo from './form-demos/ValidationDemo.vue'
import LayoutDemo from './form-demos/LayoutDemo.vue'
import DynamicFormDemo from './form-demos/DynamicFormDemo.vue'
import PopupFormDemo from './form-demos/PopupFormDemo.vue'
</script>

<style scoped>
.clever-form-demo {
  padding: 20px;
}

.demo-card {
  max-width: 1200px;
  margin: 0 auto;
}
</style>