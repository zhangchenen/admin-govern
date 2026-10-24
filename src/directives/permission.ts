import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

function checkPermission(el: HTMLElement, value: string[]) {
  const userStore = useUserStore()
  const points = userStore.userInfo.permission?.points ?? []
  const hasPermission = points.some((point) => value.includes(point))

  if (!hasPermission) {
    el.parentNode?.removeChild(el)
  }
}

const permission: Directive<HTMLElement, string[]> = {
  mounted(el, binding) {
    if (!Array.isArray(binding.value)) {
      throw new Error('v-permission value is ["admin","editor"]')
    }

    checkPermission(el, binding.value)
  },
  updated(el, binding) {
    if (!Array.isArray(binding.value)) {
      throw new Error('v-permission value is ["admin","editor"]')
    }

    checkPermission(el, binding.value)
  },
}

export default permission
