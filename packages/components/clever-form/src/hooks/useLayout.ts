/**
 * useLayout 组合式函数
 * @description 布局管理逻辑的组合式API
 */

import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import type { UseLayoutOptions, UseLayoutReturn } from './types'
import type {
  ContainerConfig,
  LayoutState,
  LayoutEvents
} from '../types'
import { layout as layoutUtils, object } from '../utils'

/**
 * 布局组合式函数
 * @param options 配置选项
 * @returns 布局状态和方法
 */
export function useLayout(options: UseLayoutOptions = {}): UseLayoutReturn {
  const {
    config,
    breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600
    },
    responsive = true
  } = options

  // 响应式状态
  const layoutConfig = ref<ContainerConfig | undefined>(config)
  const currentBreakpoint = ref<string>('lg')
  const windowWidth = ref<number>(0)
  const windowHeight = ref<number>(0)

  // 布局状态
  const layoutState = ref<LayoutState>({
    breakpoint: currentBreakpoint.value,
    width: windowWidth.value,
    height: windowHeight.value,
    cols: 24,
    gutter: 16,
    responsive: responsive
  })

  // 计算属性
  const isMobile = computed(() => {
    return currentBreakpoint.value === 'xs' || currentBreakpoint.value === 'sm'
  })

  const isTablet = computed(() => {
    return currentBreakpoint.value === 'md'
  })

  const isDesktop = computed(() => {
    return ['lg', 'xl', 'xxl'].includes(currentBreakpoint.value)
  })

  /**
   * 获取当前断点
   * @param width 窗口宽度
   * @returns 断点名称
   */
  const getCurrentBreakpoint = (width: number): string => {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a)
    
    for (const [name, minWidth] of sortedBreakpoints) {
      if (width >= minWidth) {
        return name
      }
    }
    
    return 'xs'
  }

  /**
   * 更新窗口尺寸
   */
  const updateWindowSize = (): void => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
      
      if (responsive) {
        const newBreakpoint = getCurrentBreakpoint(windowWidth.value)
        if (newBreakpoint !== currentBreakpoint.value) {
          currentBreakpoint.value = newBreakpoint
          layoutState.value.breakpoint = newBreakpoint
        }
      }
      
      layoutState.value.width = windowWidth.value
      layoutState.value.height = windowHeight.value
    }
  }

  /**
   * 设置布局配置
   * @param newConfig 新的布局配置
   */
  const setConfig = (newConfig: ContainerConfig): void => {
    layoutConfig.value = newConfig
    updateLayout()
  }

  /**
   * 更新布局
   */
  const updateLayout = (): void => {
    if (layoutConfig.value) {
      // 根据配置更新布局状态
      if (layoutConfig.value.cols) {
        layoutState.value.cols = layoutConfig.value.cols
      }
      if (layoutConfig.value.gutter !== undefined) {
        layoutState.value.gutter = layoutConfig.value.gutter
      }
    }
  }

  /**
   * 获取项目样式
   * @param item 布局项
   * @returns 样式对象
   */
  const getItemStyle = (item: any): Record<string, any> => {
    if (!item || !layoutConfig.value) {
      return {}
    }

    const style: Record<string, any> = {}
    const { cols, gutter } = layoutState.value
    const breakpoint = currentBreakpoint.value

    // 计算宽度
    let span = item.span || 24
    if (item.responsive && item.responsive[breakpoint]) {
      span = item.responsive[breakpoint].span || span
    }

    const width = (span / cols) * 100
    style.width = `${width}%`

    // 计算间距
    if (gutter > 0) {
      style.paddingLeft = `${gutter / 2}px`
      style.paddingRight = `${gutter / 2}px`
    }

    // 计算偏移
    let offset = item.offset || 0
    if (item.responsive && item.responsive[breakpoint]) {
      offset = item.responsive[breakpoint].offset || offset
    }

    if (offset > 0) {
      style.marginLeft = `${(offset / cols) * 100}%`
    }

    // 其他样式
    if (item.flex) {
      style.flex = item.flex
    }

    if (item.order !== undefined) {
      style.order = item.order
    }

    return style
  }

  /**
   * 获取容器样式
   * @returns 容器样式对象
   */
  const getContainerStyle = (): Record<string, any> => {
    const style: Record<string, any> = {}
    const { gutter } = layoutState.value

    if (gutter > 0) {
      style.marginLeft = `-${gutter / 2}px`
      style.marginRight = `-${gutter / 2}px`
    }

    if (layoutConfig.value) {
      // 容器特定样式
      if (layoutConfig.value.justify) {
        style.justifyContent = layoutConfig.value.justify
      }
      if (layoutConfig.value.align) {
        style.alignItems = layoutConfig.value.align
      }
      if (layoutConfig.value.wrap !== undefined) {
        style.flexWrap = layoutConfig.value.wrap ? 'wrap' : 'nowrap'
      }
    }

    return style
  }

  // 监听配置变化
  watch(
    () => layoutConfig.value,
    () => {
      updateLayout()
    },
    { deep: true }
  )

  // 窗口大小变化监听
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    updateWindowSize()
    
    if (typeof window !== 'undefined' && responsive) {
      // 使用 ResizeObserver 监听窗口大小变化
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => {
          updateWindowSize()
        })
        resizeObserver.observe(document.documentElement)
      } else {
        // 降级到 resize 事件
        window.addEventListener('resize', updateWindowSize)
      }
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    } else if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateWindowSize)
    }
  })

  return {
    layoutConfig,
    layoutState,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    setConfig,
    updateLayout,
    getItemStyle,
    getContainerStyle
  }
}