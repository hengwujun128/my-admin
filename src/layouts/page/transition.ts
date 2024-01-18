import type { FunctionalComponent } from 'vue'
import type { RouteLocation } from 'vue-router'

export interface DefaultContext {
  Component: FunctionalComponent & { type: Recordable }
  route: RouteLocation // 对 route 做类型定义
}
// 根据 enableTransition 开关, 缓存开关, 缓存中是否有当前的 route.name
// 如果 开启缓存,且当前 route.name 也在缓存列表 cacheTabs中 ,那么就去使用当前默认 transitionName || route.meta.transitionName
// transitionName : 来源默认的'fade-slide' 或者用户自定义的route.meta.transitionName
export function getTransitionName({
  route,
  openCache,
  cacheTabs,
  enableTransition,
  def,
}: Pick<DefaultContext, 'route'> & {
  enableTransition: boolean
  openCache: boolean
  def: string
  cacheTabs: string[]
}): string | undefined {
  if (!enableTransition) {
    return undefined
  }

  const isInCache = cacheTabs.includes(route.name as string)
  const transitionName = 'fade-slide'
  let name: string | undefined = transitionName

  if (openCache) {
    name = isInCache && route.meta.loaded ? transitionName : undefined
  }
  console.log('transition:', name)
  // 打开 openCache 开关;当前route.name 存在 cacheTabs中 且 当前route.meta.loaded 为真,就使用'fade-slide'
  // 否则, 使用当前路由自带的route.meta.transitionName
  // 最后: 使用默认值def: getBasicTransition
  // 优先级: cacheTabs缓存 + route.meta.loaded >  route.meta.transitionName >  getBasicTransition(store)
  // 一旦走缓存: 即使设置store的basicTransition:"fade-scale" 也不起作用

  return name || (route.meta.transitionName as string) || def
}
