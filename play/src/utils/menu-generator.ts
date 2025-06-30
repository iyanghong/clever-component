import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import { h } from 'vue'
import {
  HomeOutline,
  DocumentTextOutline,
  GridOutline,
  LayersOutline
} from '@vicons/ionicons5'

// 图标映射配置
const iconMap = {
  home: HomeOutline,
  overview: GridOutline,
  form: DocumentTextOutline,
  table: GridOutline,
  popup: LayersOutline
}

// 分类标签映射
const categoryLabels = {
  home: '首页',
  overview: '组件概览',
  form: 'CleverForm 表单',
  table: 'CleverTable 表格',
  popup: 'CleverPopup 弹窗'
}

// 菜单项接口
interface MenuItemConfig {
  key: string
  label: string
  category: string
  path: string
  children?: MenuItemConfig[]
}

/**
 * 从路由配置生成菜单数据
 * @param routes 路由配置数组
 * @returns 菜单配置数组
 */
export function generateMenuFromRoutes(routes: RouteRecordRaw[]): MenuItemConfig[] {
  // 按分类分组路由
  const routesByCategory = new Map<string, RouteRecordRaw[]>()
  
  routes.forEach(route => {
    const category = route.meta?.category as string || 'other'
    if (!routesByCategory.has(category)) {
      routesByCategory.set(category, [])
    }
    routesByCategory.get(category)!.push(route)
  })

  const menuItems: MenuItemConfig[] = []

  // 定义菜单顺序：首页和组件概览在最前面作为一级菜单
  const menuOrder = ['home', 'overview', 'form', 'table', 'popup']

  // 按指定顺序处理分类
  menuOrder.forEach(category => {
    const categoryRoutes = routesByCategory.get(category)
    if (!categoryRoutes || categoryRoutes.length === 0) return

    if (category === 'home' || category === 'overview') {
      // 首页和组件概览作为一级菜单
      categoryRoutes.forEach(route => {
        menuItems.push({
          key: category === 'home' ? 'home' : route.path.substring(1),
          label: route.meta?.title as string || route.name as string,
          category: category,
          path: route.path
        })
      })
    } else {
      // 其他分类作为分组菜单
      const children: MenuItemConfig[] = []
      
      categoryRoutes.forEach(route => {
        children.push({
          key: route.path.substring(1), // 移除开头的 '/'
          label: route.meta?.title as string || route.name as string,
          category: category,
          path: route.path
        })
      })

      if (children.length > 0) {
        menuItems.push({
          key: category,
          label: categoryLabels[category as keyof typeof categoryLabels] || category,
          category: category,
          path: children[0].path, // 默认跳转到第一个子项
          children: children
        })
      }
    }
  })

  // 处理其他未在顺序中的分类
  routesByCategory.forEach((categoryRoutes, category) => {
    if (!menuOrder.includes(category)) {
      const children: MenuItemConfig[] = []
      
      categoryRoutes.forEach(route => {
        children.push({
          key: route.path.substring(1),
          label: route.meta?.title as string || route.name as string,
          category: category,
          path: route.path
        })
      })

      if (children.length > 0) {
        menuItems.push({
          key: category,
          label: categoryLabels[category as keyof typeof categoryLabels] || category,
          category: category,
          path: children[0].path,
          children: children
        })
      }
    }
  })

  return menuItems
}

/**
 * 将菜单配置转换为 Naive UI 菜单选项
 * @param menuItems 菜单配置数组
 * @returns Naive UI 菜单选项数组
 */
export function convertToNaiveMenuOptions(menuItems: MenuItemConfig[]): MenuOption[] {
  return menuItems.map(item => {
    const option: MenuOption = {
      label: item.label,
      key: item.key,
      icon: () => {
        const IconComponent = iconMap[item.category as keyof typeof iconMap]
        return IconComponent ? h(IconComponent) : undefined
      }
    }

    if (item.children && item.children.length > 0) {
      option.children = item.children.map(child => ({
        label: child.label,
        key: child.key
      }))
    }

    return option
  })
}

/**
 * 根据菜单key获取对应的路径
 * @param menuItems 菜单配置数组
 * @param key 菜单key
 * @returns 对应的路径
 */
export function getPathByMenuKey(menuItems: MenuItemConfig[], key: string): string {
  for (const item of menuItems) {
    if (item.key === key) {
      return item.path
    }
    
    if (item.children) {
      for (const child of item.children) {
        if (child.key === key) {
          return child.path
        }
      }
    }
  }
  
  // 如果没找到，尝试直接构造路径
  if (key === 'home') {
    return '/'
  }
  
  return `/${key}`
}

/**
 * 根据当前路径获取激活的菜单key
 * @param path 当前路径
 * @returns 激活的菜单key
 */
export function getActiveKeyByPath(path: string): string {
  if (path === '/') {
    return 'home'
  }
  
  // 移除开头的 '/'
  return path.substring(1)
}