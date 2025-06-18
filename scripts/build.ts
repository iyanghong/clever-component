import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '..')
const distDir = resolve(root, 'dist')

// 清理构建目录
if (existsSync(distDir)) {
  console.log('🧹 清理构建目录...')
  rmSync(distDir, { recursive: true, force: true })
}

// 构建组件库
console.log('📦 构建组件库...')
try {
  execSync('pnpm build:lib', { stdio: 'inherit', cwd: root })
  console.log('✅ 组件库构建完成')
} catch (error) {
  console.error('❌ 组件库构建失败:', error)
  process.exit(1)
}

// 生成类型定义
console.log('📝 生成类型定义...')
try {
  execSync('pnpm build:types', { stdio: 'inherit', cwd: root })
  console.log('✅ 类型定义生成完成')
} catch (error) {
  console.error('❌ 类型定义生成失败:', error)
  process.exit(1)
}

console.log('🎉 构建完成！')