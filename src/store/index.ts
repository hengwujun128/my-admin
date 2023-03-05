import type { App } from 'vue'
import { createPinia } from 'pinia'
// 创建 store 实例
const store = createPinia()

// 导出一个函数,作为vue 插件使用
export function setupStore(app: App<Element>) {
  app.use(store)
}
// 直接导出一个实例
export { store }
