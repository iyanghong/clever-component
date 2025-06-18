# CleverPopup 智能弹窗

智能弹窗组件，支持多种弹窗类型和自定义配置。

## 基础用法

基础的弹窗用法。

```vue
<template>
  <div>
    <CButton @click="showPopup = true">打开弹窗</CButton>
    
    <CleverPopup
      v-model:show="showPopup"
      title="基础弹窗"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <p>这是弹窗内容</p>
      <p>可以放置任何内容</p>
    </CleverPopup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CleverPopup, CButton } from '@clever-component/components'

const showPopup = ref(false)

const handleConfirm = () => {
  console.log('确认')
  showPopup.value = false
}

const handleCancel = () => {
  console.log('取消')
  showPopup.value = false
}
</script>
```

## 不同类型

支持不同类型的弹窗。

```vue
<template>
  <div>
    <CButton @click="showInfo = true">信息弹窗</CButton>
    <CButton @click="showSuccess = true">成功弹窗</CButton>
    <CButton @click="showWarning = true">警告弹窗</CButton>
    <CButton @click="showError = true">错误弹窗</CButton>
    
    <CleverPopup
      v-model:show="showInfo"
      type="info"
      title="信息"
      content="这是一条信息"
    />
    
    <CleverPopup
      v-model:show="showSuccess"
      type="success"
      title="成功"
      content="操作成功"
    />
    
    <CleverPopup
      v-model:show="showWarning"
      type="warning"
      title="警告"
      content="这是一条警告信息"
    />
    
    <CleverPopup
      v-model:show="showError"
      type="error"
      title="错误"
      content="操作失败"
    />
  </div>
</template>

<script setup>
const showInfo = ref(false)
const showSuccess = ref(false)
const showWarning = ref(false)
const showError = ref(false)
</script>
```

## 不同尺寸

支持不同尺寸的弹窗。

```vue
<template>
  <div>
    <CButton @click="showSmall = true">小型弹窗</CButton>
    <CButton @click="showMedium = true">中型弹窗</CButton>
    <CButton @click="showLarge = true">大型弹窗</CButton>
    <CButton @click="showFullscreen = true">全屏弹窗</CButton>
    
    <CleverPopup
      v-model:show="showSmall"
      size="small"
      title="小型弹窗"
      content="这是小型弹窗"
    />
    
    <CleverPopup
      v-model:show="showMedium"
      size="medium"
      title="中型弹窗"
      content="这是中型弹窗"
    />
    
    <CleverPopup
      v-model:show="showLarge"
      size="large"
      title="大型弹窗"
      content="这是大型弹窗"
    />
    
    <CleverPopup
      v-model:show="showFullscreen"
      size="fullscreen"
      title="全屏弹窗"
      content="这是全屏弹窗"
    />
  </div>
</template>

<script setup>
const showSmall = ref(false)
const showMedium = ref(false)
const showLarge = ref(false)
const showFullscreen = ref(false)
</script>
```

## 自定义按钮

可以自定义弹窗按钮。

```vue
<template>
  <div>
    <CButton @click="showCustom = true">自定义按钮</CButton>
    
    <CleverPopup
      v-model:show="showCustom"
      title="自定义按钮"
      :show-cancel="false"
      confirm-text="知道了"
      @confirm="showCustom = false"
    >
      <p>这是自定义按钮的弹窗</p>
    </CleverPopup>
  </div>
</template>

<script setup>
const showCustom = ref(false)
</script>
```

## 异步操作

支持异步操作的弹窗。

```vue
<template>
  <div>
    <CButton @click="showAsync = true">异步操作</CButton>
    
    <CleverPopup
      v-model:show="showAsync"
      title="异步操作"
      :loading="loading"
      @confirm="handleAsyncConfirm"
      @cancel="showAsync = false"
    >
      <p>点击确认将执行异步操作</p>
    </CleverPopup>
  </div>
</template>

<script setup>
const showAsync = ref(false)
const loading = ref(false)

const handleAsyncConfirm = async () => {
  loading.value = true
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    showAsync.value = false
  } finally {
    loading.value = false
  }
}
</script>
```

## 无遮罩层

可以设置无遮罩层的弹窗。

```vue
<template>
  <div>
    <CButton @click="showNoMask = true">无遮罩弹窗</CButton>
    
    <CleverPopup
      v-model:show="showNoMask"
      title="无遮罩弹窗"
      :mask="false"
      @confirm="showNoMask = false"
    >
      <p>这是无遮罩层的弹窗</p>
    </CleverPopup>
  </div>
</template>

<script setup>
const showNoMask = ref(false)
</script>
```

## API

### CleverPopup Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| show / v-model | 是否显示弹窗 | boolean | — | false |
| title | 弹窗标题 | string | — | — |
| content | 弹窗内容 | string | — | — |
| type | 弹窗类型 | string | info / success / warning / error | — |
| size | 弹窗尺寸 | string | small / medium / large / fullscreen | medium |
| width | 弹窗宽度 | string / number | — | — |
| height | 弹窗高度 | string / number | — | — |
| mask | 是否显示遮罩层 | boolean | — | true |
| mask-closable | 点击遮罩层是否关闭弹窗 | boolean | — | true |
| closable | 是否显示关闭按钮 | boolean | — | true |
| show-confirm | 是否显示确认按钮 | boolean | — | true |
| show-cancel | 是否显示取消按钮 | boolean | — | true |
| confirm-text | 确认按钮文本 | string | — | 确认 |
| cancel-text | 取消按钮文本 | string | — | 取消 |
| loading | 是否显示加载状态 | boolean | — | false |
| z-index | 弹窗层级 | number | — | 1000 |

### CleverPopup Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| confirm | 点击确认按钮时触发 | — |
| cancel | 点击取消按钮时触发 | — |
| close | 弹窗关闭时触发 | — |
| open | 弹窗打开时触发 | — |
| mask-click | 点击遮罩层时触发 | — |

### CleverPopup Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 弹窗内容 |
| header | 弹窗头部 |
| footer | 弹窗底部 |
| icon | 弹窗图标 |

### CleverPopup Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| open | 打开弹窗 | — |
| close | 关闭弹窗 | — |