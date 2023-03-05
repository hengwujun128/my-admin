/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { App, Directive, DirectiveBinding } from 'vue'

import { usePermission } from '/@/hooks/web/usePermission'

function isAuth(el: Element, binding: any) {
  const { hasPermission } = usePermission()

  const value = binding.value
  if (!value) return
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el)
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding)
}
/**
 * 定义个一个指令对象
 */
const authDirective: Directive = {
  mounted,
}
/**
 * 通过插件形式全局注册权限指令
 */
export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective)
}

export default authDirective
