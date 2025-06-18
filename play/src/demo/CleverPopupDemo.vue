<template>
  <div class="clever-popup-demo">
    <n-space vertical size="large">
      <!-- 基础用法 -->
      <n-card title="基础用法">
        <n-space>
          <n-button @click="showBasicPopup">显示基础弹窗</n-button>
          <n-button @click="showCustomPopup">显示自定义弹窗</n-button>
          <n-button @click="showNoMaskPopup">无遮罩弹窗</n-button>
        </n-space>
        
        <CleverPopup
          v-model:visible="basicVisible"
          title="基础弹窗"
          @confirm="handleBasicConfirm"
          @cancel="handleBasicCancel"
        >
          <p>这是一个基础的弹窗内容。</p>
          <p>您可以在这里放置任何内容。</p>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="customVisible"
          title="自定义弹窗"
          width="600px"
          :closable="false"
          confirm-text="保存"
          cancel-text="取消"
          @confirm="handleCustomConfirm"
          @cancel="handleCustomCancel"
        >
          <div style="padding: 20px;">
            <h3>自定义内容</h3>
            <n-form>
              <n-form-item label="用户名">
                <n-input v-model:value="formData.username" placeholder="请输入用户名" />
              </n-form-item>
              <n-form-item label="邮箱">
                <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
              </n-form-item>
              <n-form-item label="描述">
                <n-input
                  v-model:value="formData.description"
                  type="textarea"
                  placeholder="请输入描述"
                  :rows="3"
                />
              </n-form-item>
            </n-form>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="noMaskVisible"
          title="无遮罩弹窗"
          :mask="false"
          :mask-closable="false"
        >
          <p>这是一个没有遮罩的弹窗。</p>
          <p>点击外部区域不会关闭弹窗。</p>
        </CleverPopup>
      </n-card>

      <!-- 不同尺寸 -->
      <n-card title="不同尺寸">
        <n-space>
          <n-button @click="showSmallPopup">小尺寸</n-button>
          <n-button @click="showMediumPopup">中等尺寸</n-button>
          <n-button @click="showLargePopup">大尺寸</n-button>
          <n-button @click="showFullscreenPopup">全屏</n-button>
        </n-space>
        
        <CleverPopup
          v-model:visible="smallVisible"
          title="小尺寸弹窗"
          width="400px"
        >
          <p>这是一个小尺寸的弹窗。</p>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="mediumVisible"
          title="中等尺寸弹窗"
          width="600px"
        >
          <p>这是一个中等尺寸的弹窗。</p>
          <p>内容可以更丰富一些。</p>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="largeVisible"
          title="大尺寸弹窗"
          width="800px"
        >
          <div>
            <p>这是一个大尺寸的弹窗。</p>
            <n-divider />
            <n-space vertical>
              <n-alert type="info">
                这里可以放置更多的内容和组件。
              </n-alert>
              <n-table :bordered="false" :single-line="false">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>城市</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>张三</td>
                    <td>25</td>
                    <td>北京</td>
                  </tr>
                  <tr>
                    <td>李四</td>
                    <td>30</td>
                    <td>上海</td>
                  </tr>
                </tbody>
              </n-table>
            </n-space>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="fullscreenVisible"
          title="全屏弹窗"
          :fullscreen="true"
        >
          <div style="height: 100%; padding: 20px;">
            <h2>全屏弹窗内容</h2>
            <p>这是一个全屏显示的弹窗。</p>
            <n-divider />
            <n-grid :cols="2" :x-gap="20">
              <n-grid-item>
                <n-card title="左侧内容">
                  <p>这里是左侧的内容区域。</p>
                  <n-space vertical>
                    <n-button>按钮1</n-button>
                    <n-button>按钮2</n-button>
                    <n-button>按钮3</n-button>
                  </n-space>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card title="右侧内容">
                  <p>这里是右侧的内容区域。</p>
                  <n-progress type="line" :percentage="75" />
                  <n-progress type="circle" :percentage="60" style="margin-top: 20px;" />
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>
        </CleverPopup>
      </n-card>

      <!-- 不同类型 -->
      <n-card title="不同类型">
        <n-space>
          <n-button @click="showInfoPopup" type="info">信息弹窗</n-button>
          <n-button @click="showSuccessPopup" type="success">成功弹窗</n-button>
          <n-button @click="showWarningPopup" type="warning">警告弹窗</n-button>
          <n-button @click="showErrorPopup" type="error">错误弹窗</n-button>
        </n-space>
        
        <CleverPopup
          v-model:visible="infoVisible"
          title="信息提示"
          type="info"
        >
          <div style="display: flex; align-items: center;">
            <n-icon size="24" color="#2080f0" style="margin-right: 12px;">
              <InformationCircleOutline />
            </n-icon>
            <span>这是一条信息提示内容。</span>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="successVisible"
          title="操作成功"
          type="success"
        >
          <div style="display: flex; align-items: center;">
            <n-icon size="24" color="#18a058" style="margin-right: 12px;">
              <CheckmarkCircleOutline />
            </n-icon>
            <span>操作已成功完成！</span>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="warningVisible"
          title="警告提示"
          type="warning"
        >
          <div style="display: flex; align-items: center;">
            <n-icon size="24" color="#f0a020" style="margin-right: 12px;">
              <WarningOutline />
            </n-icon>
            <span>请注意，这个操作可能会产生风险。</span>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="errorVisible"
          title="错误提示"
          type="error"
        >
          <div style="display: flex; align-items: center;">
            <n-icon size="24" color="#d03050" style="margin-right: 12px;">
              <CloseCircleOutline />
            </n-icon>
            <span>操作失败，请检查输入信息后重试。</span>
          </div>
        </CleverPopup>
      </n-card>

      <!-- 异步操作 -->
      <n-card title="异步操作">
        <n-space>
          <n-button @click="showAsyncPopup">异步确认</n-button>
          <n-button @click="showLoadingPopup">加载中弹窗</n-button>
        </n-space>
        
        <CleverPopup
          v-model:visible="asyncVisible"
          title="异步操作确认"
          :loading="asyncLoading"
          @confirm="handleAsyncConfirm"
        >
          <p>点击确认按钮将执行异步操作。</p>
          <p>操作期间按钮会显示加载状态。</p>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="loadingVisible"
          title="数据加载中"
          :show-footer="false"
          :closable="false"
          :mask-closable="false"
        >
          <div style="text-align: center; padding: 40px;">
            <n-spin size="large" />
            <p style="margin-top: 16px;">正在加载数据，请稍候...</p>
          </div>
        </CleverPopup>
      </n-card>

      <!-- 嵌套弹窗 -->
      <n-card title="嵌套弹窗">
        <n-button @click="showParentPopup">打开父弹窗</n-button>
        
        <CleverPopup
          v-model:visible="parentVisible"
          title="父弹窗"
          width="500px"
        >
          <div>
            <p>这是父弹窗的内容。</p>
            <n-space>
              <n-button @click="showChildPopup">打开子弹窗</n-button>
              <n-button @click="showAnotherChildPopup">打开另一个子弹窗</n-button>
            </n-space>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="childVisible"
          title="子弹窗"
          width="400px"
        >
          <p>这是子弹窗的内容。</p>
          <p>可以在父弹窗的基础上再打开子弹窗。</p>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="anotherChildVisible"
          title="另一个子弹窗"
          width="450px"
        >
          <div>
            <p>这是另一个子弹窗。</p>
            <n-button @click="showGrandchildPopup">打开孙弹窗</n-button>
          </div>
        </CleverPopup>
        
        <CleverPopup
          v-model:visible="grandchildVisible"
          title="孙弹窗"
          width="350px"
        >
          <p>这是孙弹窗，第三层嵌套。</p>
        </CleverPopup>
      </n-card>

      <!-- 结果显示 -->
      <n-card title="操作结果" v-if="result">
        <n-alert type="info">
          {{ result }}
        </n-alert>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  NSpace,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NDivider,
  NAlert,
  NTable,
  NGrid,
  NGridItem,
  NProgress,
  NIcon,
  NSpin
} from 'naive-ui'
import {
  InformationCircleOutline,
  CheckmarkCircleOutline,
  WarningOutline,
  CloseCircleOutline
} from '@vicons/ionicons5'
import { CleverPopup } from '@clever-component'

// 弹窗显示状态
const basicVisible = ref(false)
const customVisible = ref(false)
const noMaskVisible = ref(false)
const smallVisible = ref(false)
const mediumVisible = ref(false)
const largeVisible = ref(false)
const fullscreenVisible = ref(false)
const infoVisible = ref(false)
const successVisible = ref(false)
const warningVisible = ref(false)
const errorVisible = ref(false)
const asyncVisible = ref(false)
const loadingVisible = ref(false)
const parentVisible = ref(false)
const childVisible = ref(false)
const anotherChildVisible = ref(false)
const grandchildVisible = ref(false)

// 其他状态
const asyncLoading = ref(false)
const result = ref('')

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  description: ''
})

// 基础弹窗方法
const showBasicPopup = () => {
  basicVisible.value = true
}

const showCustomPopup = () => {
  customVisible.value = true
}

const showNoMaskPopup = () => {
  noMaskVisible.value = true
}

const handleBasicConfirm = () => {
  result.value = '基础弹窗：用户点击了确认按钮'
  basicVisible.value = false
}

const handleBasicCancel = () => {
  result.value = '基础弹窗：用户点击了取消按钮'
}

const handleCustomConfirm = () => {
  result.value = `自定义弹窗：保存数据 - ${JSON.stringify(formData)}`
  customVisible.value = false
}

const handleCustomCancel = () => {
  result.value = '自定义弹窗：用户取消了操作'
  // 重置表单数据
  Object.assign(formData, {
    username: '',
    email: '',
    description: ''
  })
}

// 尺寸弹窗方法
const showSmallPopup = () => {
  smallVisible.value = true
}

const showMediumPopup = () => {
  mediumVisible.value = true
}

const showLargePopup = () => {
  largeVisible.value = true
}

const showFullscreenPopup = () => {
  fullscreenVisible.value = true
}

// 类型弹窗方法
const showInfoPopup = () => {
  infoVisible.value = true
}

const showSuccessPopup = () => {
  successVisible.value = true
}

const showWarningPopup = () => {
  warningVisible.value = true
}

const showErrorPopup = () => {
  errorVisible.value = true
}

// 异步操作方法
const showAsyncPopup = () => {
  asyncVisible.value = true
}

const showLoadingPopup = () => {
  loadingVisible.value = true
  // 模拟加载过程
  setTimeout(() => {
    loadingVisible.value = false
    result.value = '数据加载完成！'
  }, 3000)
}

const handleAsyncConfirm = async () => {
  asyncLoading.value = true
  
  try {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    result.value = '异步操作成功完成！'
    asyncVisible.value = false
  } catch (error) {
    result.value = '异步操作失败！'
  } finally {
    asyncLoading.value = false
  }
}

// 嵌套弹窗方法
const showParentPopup = () => {
  parentVisible.value = true
}

const showChildPopup = () => {
  childVisible.value = true
}

const showAnotherChildPopup = () => {
  anotherChildVisible.value = true
}

const showGrandchildPopup = () => {
  grandchildVisible.value = true
}
</script>

<style scoped>
.clever-popup-demo {
  max-width: 100%;
}
</style>