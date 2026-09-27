import router from '@/router'
import { useUserStore } from '@/stores/user'
const whiteList = ['/login']
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (userStore.token) {
    if (to.path === '/login') {
      return '/'
    }
    return true
  }

  if (whiteList.includes(to.path)) {
    return true
  }

  return '/login'
})
