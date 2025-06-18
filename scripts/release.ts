import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(__dirname, '..')
const packageJsonPath = resolve(root, 'package.json')

// 读取当前版本
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const currentVersion = packageJson.version

console.log(`📦 当前版本: ${currentVersion}`)

// 检查工作目录是否干净
try {
  execSync('git diff --exit-code', { stdio: 'pipe', cwd: root })
  execSync('git diff --cached --exit-code', { stdio: 'pipe', cwd: root })
} catch {
  console.error('❌ 工作目录不干净，请先提交所有更改')
  process.exit(1)
}

// 运行测试
console.log('🧪 运行测试...')
try {
  execSync('pnpm test', { stdio: 'inherit', cwd: root })
  console.log('✅ 测试通过')
} catch (error) {
  console.error('❌ 测试失败:', error)
  process.exit(1)
}

// 构建项目
console.log('📦 构建项目...')
try {
  execSync('pnpm build', { stdio: 'inherit', cwd: root })
  console.log('✅ 构建完成')
} catch (error) {
  console.error('❌ 构建失败:', error)
  process.exit(1)
}

// 更新版本号
console.log('🔖 更新版本号...')
try {
  execSync('pnpm bumpp', { stdio: 'inherit', cwd: root })
  console.log('✅ 版本号更新完成')
} catch (error) {
  console.error('❌ 版本号更新失败:', error)
  process.exit(1)
}

// 读取新版本
const newPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const newVersion = newPackageJson.version

if (newVersion === currentVersion) {
  console.log('📦 版本号未更改，跳过发布')
  process.exit(0)
}

console.log(`🚀 发布版本: ${newVersion}`)

// 发布到 npm
try {
  execSync('npm publish', { stdio: 'inherit', cwd: root })
  console.log('✅ 发布到 npm 成功')
} catch (error) {
  console.error('❌ 发布到 npm 失败:', error)
  process.exit(1)
}

// 推送到 Git
try {
  execSync('git push --follow-tags', { stdio: 'inherit', cwd: root })
  console.log('✅ 推送到 Git 成功')
} catch (error) {
  console.error('❌ 推送到 Git 失败:', error)
  process.exit(1)
}

console.log('🎉 发布完成！')