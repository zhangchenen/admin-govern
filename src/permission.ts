import router from '@/router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
const whiteList = ['/login']
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (!userStore.token) {
    return whiteList.includes(to.path) ? true : '/login'
  }

  if (to.path === '/login') {
    return '/'
  }

  const permissionStore = usePermissionStore()
  if (permissionStore.routes.length === 0) {
    const { permission } = await userStore.getUserInfo()
    const filterRoutes = permissionStore.filterRoutes(permission.menus)

    filterRoutes.forEach((route) => {
      router.addRoute(route)
    })

    // 路由注册完成后重新匹配当前地址
    return to.fullPath
  }

  return true
})
