import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import {
  generateMenuFromRoutes,
  convertToNaiveMenuOptions,
  getPathByMenuKey,
  getActiveKeyByPath
} from '../utils/menu-generator'

/**
 * 菜单管理组合式函数
 * @returns 菜单相关的响应式数据和方法
 */
export function useMenu() {
  const router = useRouter()
  const route = useRoute()

  // 从路由配置生成菜单数据
  const menuItems = computed(() => {
    return generateMenuFromRoutes(router.getRoutes())
  })

  // 转换为 Naive UI 菜单选项
  const menuOptions = computed<MenuOption[]>(() => {
    return convertToNaiveMenuOptions(menuItems.value)
  })

  // 当前激活的菜单项
  const activeKey = computed(() => {
    return getActiveKeyByPath(route.path)
  })

  // 当前页面标题
  const currentTitle = computed(() => {
    return route.meta?.title as string || 'Clever Component 开发预览'
  })

  // 菜单选择处理
  const handleMenuSelect = (key: string) => {
    const path = getPathByMenuKey(menuItems.value, key)
    if (path && path !== route.path) {
      router.push(path)
    }
  }

  return {
    menuItems,
    menuOptions,
    activeKey,
    currentTitle,
    handleMenuSelect
  }
}