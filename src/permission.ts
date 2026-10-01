import router from '@/router'
import { useUserStore } from '@/stores/user'
const whiteList = ['/login']
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (userStore.token) {
    if (to.path === '/login') {
      return '/'
    } else {
      if (Object.keys(userStore.userInfo).length === 0) {
        await userStore.getUserInfo()
      }
      return true
    }
  }

  if (whiteList.includes(to.path)) {
    return true
  }

  return '/login'
})
