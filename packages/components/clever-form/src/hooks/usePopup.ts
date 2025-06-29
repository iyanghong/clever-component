/**
 * usePopup 组合式函数
 * @description 弹窗管理逻辑的组合式API
 */

import { ref, computed, reactive, watch, nextTick, onUnmounted } from 'vue'
import type { UsePopupOptions, UsePopupReturn } from './types'
import type {
  PopupConfig,
  PopupState,
  PopupMethods,
  PopupEvents
} from '../types'
import { object, error } from '../utils'
import { ERROR_CODES } from '../constants'

/**
 * 弹窗组合式函数
 * @param options 配置选项
 * @returns 弹窗状态和方法
 */
export function usePopup(options: UsePopupOptions = {}): UsePopupReturn {
  const {
    config,
    visible: initialVisible = false,
    closable = true,
    onOpen,
    onClose,
    onConfirm,
    onCancel
  } = options

  // 响应式状态
  const popupConfig = ref<PopupConfig | undefined>(config)
  const visible = ref<boolean>(initialVisible)
  const loading = ref<boolean>(false)

  // 弹窗状态
  const popupState = ref<PopupState>({
    visible: visible.value,
    loading: loading.value,
    data: null,
    result: null,
    error: null,
    closable: closable
  })

  // 内部状态
  const zIndex = ref<number>(1000)
  const animating = ref<boolean>(false)
  const destroyed = ref<boolean>(false)

  /**
   * 打开弹窗
   * @param newConfig 弹窗配置
   */
  const open = async (newConfig?: PopupConfig): Promise<void> => {
    if (destroyed.value || animating.value) {
      return
    }

    try {
      animating.value = true
      
      // 更新配置
      if (newConfig) {
        popupConfig.value = { ...popupConfig.value, ...newConfig }
      }

      // 更新状态
      visible.value = true
      popupState.value.visible = true
      popupState.value.error = null

      // 计算层级
      zIndex.value = getNextZIndex()

      // 等待DOM更新
      await nextTick()

      // 触发打开事件
      onOpen?.()

      // 如果有打开动画，等待动画完成
      if (popupConfig.value?.animation?.enter) {
        await new Promise(resolve => {
          setTimeout(resolve, popupConfig.value?.animation?.duration || 300)
        })
      }
    } catch (err) {
      console.error('弹窗打开失败:', err)
      popupState.value.error = error.createError(ERROR_CODES.POPUP_ERROR, '弹窗打开失败')
    } finally {
      animating.value = false
    }
  }

  /**
   * 关闭弹窗
   */
  const close = async (): Promise<void> => {
    if (destroyed.value || animating.value || !popupState.value.closable) {
      return
    }

    try {
      animating.value = true

      // 如果有关闭动画，先播放动画
      if (popupConfig.value?.animation?.leave) {
        await new Promise(resolve => {
          setTimeout(resolve, popupConfig.value?.animation?.duration || 300)
        })
      }

      // 更新状态
      visible.value = false
      popupState.value.visible = false
      popupState.value.result = null
      popupState.value.error = null

      // 触发关闭事件
      onClose?.()

      // 等待DOM更新
      await nextTick()
    } catch (err) {
      console.error('弹窗关闭失败:', err)
    } finally {
      animating.value = false
    }
  }

  /**
   * 确认操作
   * @param data 确认数据
   */
  const confirm = async (data?: any): Promise<void> => {
    if (destroyed.value) {
      return
    }

    try {
      loading.value = true
      popupState.value.loading = true
      popupState.value.data = data

      // 触发确认事件
      await onConfirm?.(data)

      // 设置结果
      popupState.value.result = { type: 'confirm', data }

      // 自动关闭（如果配置了）
      if (popupConfig.value?.autoClose !== false) {
        await close()
      }
    } catch (err) {
      console.error('确认操作失败:', err)
      popupState.value.error = error.createError(ERROR_CODES.POPUP_ERROR, '确认操作失败')
    } finally {
      loading.value = false
      popupState.value.loading = false
    }
  }

  /**
   * 取消操作
   */
  const cancel = async (): Promise<void> => {
    if (destroyed.value) {
      return
    }

    try {
      // 触发取消事件
      await onCancel?.()

      // 设置结果
      popupState.value.result = { type: 'cancel', data: null }

      // 关闭弹窗
      await close()
    } catch (err) {
      console.error('取消操作失败:', err)
      popupState.value.error = error.createError(ERROR_CODES.POPUP_ERROR, '取消操作失败')
    }
  }

  /**
   * 设置弹窗配置
   * @param newConfig 新配置
   */
  const setConfig = (newConfig: PopupConfig): void => {
    popupConfig.value = { ...popupConfig.value, ...newConfig }
    
    // 更新相关状态
    if (newConfig.closable !== undefined) {
      popupState.value.closable = newConfig.closable
    }
  }

  /**
   * 设置加载状态
   * @param isLoading 是否加载中
   */
  const setLoading = (isLoading: boolean): void => {
    loading.value = isLoading
    popupState.value.loading = isLoading
  }

  /**
   * 获取下一个z-index值
   * @returns z-index值
   */
  const getNextZIndex = (): number => {
    // 简单的z-index管理，实际项目中可能需要更复杂的逻辑
    const currentMax = Math.max(
      ...Array.from(document.querySelectorAll('[data-popup]'))
        .map(el => parseInt(getComputedStyle(el).zIndex) || 0)
    )
    return Math.max(currentMax + 1, 1000)
  }

  /**
   * 处理ESC键关闭
   */
  const handleEscClose = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && visible.value && popupState.value.closable) {
      close()
    }
  }

  /**
   * 处理点击遮罩关闭
   */
  const handleMaskClose = (): void => {
    if (popupConfig.value?.maskClosable && popupState.value.closable) {
      close()
    }
  }

  // 监听状态变化
  watch(
    () => visible.value,
    (newVisible) => {
      popupState.value.visible = newVisible
      
      if (newVisible) {
        // 添加键盘事件监听
        document.addEventListener('keydown', handleEscClose)
        // 阻止body滚动
        if (popupConfig.value?.lockScroll !== false) {
          document.body.style.overflow = 'hidden'
        }
      } else {
        // 移除键盘事件监听
        document.removeEventListener('keydown', handleEscClose)
        // 恢复body滚动
        document.body.style.overflow = ''
      }
    }
  )

  watch(
    () => loading.value,
    (newLoading) => {
      popupState.value.loading = newLoading
    }
  )

  // 清理资源
  onUnmounted(() => {
    destroyed.value = true
    document.removeEventListener('keydown', handleEscClose)
    document.body.style.overflow = ''
  })

  return {
    popupState,
    popupConfig,
    visible,
    loading,
    open,
    close,
    confirm,
    cancel,
    setConfig,
    setLoading
  }
}