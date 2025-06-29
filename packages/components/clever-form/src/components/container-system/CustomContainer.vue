<template>
  <!-- 自定义容器渲染 -->
  <component
    v-if="customComponent"
    :is="customComponent"
    v-bind="customProps"
    :config="config"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    @field:change="$emit('field:change', $event)"
    @field:focus="$emit('field:focus', $event)"
    @field:blur="$emit('field:blur', $event)"
    @validate="$emit('validate', $event)"
  >
    <!-- 渲染子项 -->
    <template v-for="(child, index) in config.children" :key="getChildKey(child, index)">
      <FieldRenderer
        v-if="isFieldConfig(child)"
        :config="child"
        :disabled="disabled"
        :readonly="readonly"
        :loading="loading"
        @field:change="$emit('field:change', $event)"
        @field:focus="$emit('field:focus', $event)"
        @field:blur="$emit('field:blur', $event)"
        @validate="$emit('validate', $event)"
      />
      <ContainerRenderer
        v-else
        :config="child"
        :disabled="disabled"
        :readonly="readonly"
        :loading="loading"
        @field:change="$emit('field:change', $event)"
        @field:focus="$emit('field:focus', $event)"
        @field:blur="$emit('field:blur', $event)"
        @validate="$emit('validate', $event)"
      />
    </template>
    
    <!-- 透传所有插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </component>
  
  <!-- 使用自定义渲染函数 -->
  <div v-else-if="config.render" class="custom-container">
    <!-- 通过 render 函数渲染 -->
    <component :is="renderContent" />
  </div>
  
  <!-- 默认渲染 -->
  <div v-else class="custom-container custom-container--default">
    <div class="custom-container__header" v-if="config.title">
      <h4 class="custom-container__title">{{ config.title }}</h4>
      <p v-if="config.description" class="custom-container__description">
        {{ config.description }}
      </p>
    </div>
    
    <div class="custom-container__content">
      <!-- 渲染子项 -->
      <template v-for="(child, index) in config.children" :key="getChildKey(child, index)">
        <FieldRenderer
          v-if="isFieldConfig(child)"
          :config="child"
          :disabled="disabled"
          :readonly="readonly"
          :loading="loading"
          @field:change="$emit('field:change', $event)"
          @field:focus="$emit('field:focus', $event)"
          @field:blur="$emit('field:blur', $event)"
          @validate="$emit('validate', $event)"
        />
        <ContainerRenderer
          v-else
          :config="child"
          :disabled="disabled"
          :readonly="readonly"
          :loading="loading"
          @field:change="$emit('field:change', $event)"
          @field:focus="$emit('field:focus', $event)"
          @field:blur="$emit('field:blur', $event)"
          @validate="$emit('validate', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, defineAsyncComponent } from 'vue'
import type {
  CustomContainerConfig,
  FieldConfig,
  ContainerConfig,
  ValidationResult
} from '../../types'
import { COMPONENT_NAMES } from '../../constants'
import FieldRenderer from '../field-components/FieldRenderer.vue'

// 避免循环引用，使用动态导入
const ContainerRenderer = defineAsyncComponent(() => import('./ContainerRenderer.vue'))

// 组件名称
defineOptions({
  name: COMPONENT_NAMES.CUSTOM_CONTAINER || 'CustomContainer'
})

// Props定义
interface Props {
  /** 自定义容器配置 */
  config: CustomContainerConfig
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否加载中 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  loading: false
})

// Events定义
interface Emits {
  'field:change': [field: string, value: any, oldValue: any]
  'field:focus': [field: string]
  'field:blur': [field: string]
  'validate': [result: ValidationResult]
}

defineEmits<Emits>()

// 计算自定义组件
const customComponent = computed(() => {
  if (typeof props.config.customComponent === 'function') {
    return props.config.customComponent()
  }
  return props.config.customComponent
})

// 计算自定义属性
const customProps = computed(() => {
  return {
    ...props.config.customProps,
    ...props.config.props
  }
})

// 渲染内容（用于 render 函数）
const renderContent = computed(() => {
  if (!props.config.render) return null
  
  // 渲染子组件
  const children = props.config.children.map((child, index) => {
    if (isFieldConfig(child)) {
      return h(FieldRenderer, {
        key: getChildKey(child, index),
        config: child,
        disabled: props.disabled,
        readonly: props.readonly,
        loading: props.loading
      })
    } else {
      return h(ContainerRenderer, {
        key: getChildKey(child, index),
        config: child,
        disabled: props.disabled,
        readonly: props.readonly,
        loading: props.loading
      })
    }
  })
  
  return props.config.render(children, props.config)
})

// 判断是否为字段配置
const isFieldConfig = (config: FieldConfig | ContainerConfig): config is FieldConfig => {
  return 'component' in config
}

// 获取子项的key
const getChildKey = (child: FieldConfig | ContainerConfig, index: number): string => {
  if ('field' in child) {
    return child.field
  }
  if ('title' in child && child.title) {
    return child.title
  }
  return `container-${index}`
}
</script>

<style lang="less">
.custom-container {
  &--default {
    .custom-container__header {
      margin-bottom: 16px;
    }
    
    .custom-container__title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--n-text-color-1);
    }
    
    .custom-container__description {
      margin: 0;
      font-size: 14px;
      color: var(--n-text-color-3);
    }
    
    .custom-container__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>