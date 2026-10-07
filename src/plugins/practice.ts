import type { App } from 'vue'
import type { InjectionKey } from 'vue'
type PermissionOptions = {
  getPermissions: () => readonly string[]
}
const permissionKey: InjectionKey<PermissionService> = Symbol('permissions')
type PermissionService = {
  has: (permission: string) => boolean
}
export default {
  install(app: App, options: PermissionOptions) {
    const service: PermissionService = {
      has(permission) {
        return options.getPermissions().includes(permission)
      },
    }
    app.provide(permissionKey, service)
    app.directive<HTMLElement, string>('permissions', {
      mounted(el, binding) {
        el.hidden = !service.has(binding.value)
      },
      updated(el, binding) {
        el.hidden = !service.has(binding.value)
      },
    })
  },
}
