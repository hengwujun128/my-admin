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
  return name || (route.meta.transitionName as string) || def
}
