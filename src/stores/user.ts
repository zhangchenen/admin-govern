import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo as getUser } from '@/api/sys'
import md5 from 'md5'
import type { userLoginInfo } from '@/views/login/type'
import type { userInfo as UserInfo } from '@/types/entity'
import { ref } from 'vue'
import router from '@/router'
import { setTimeStamp } from '@/utils/auth'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<Partial<UserInfo>>({})
    function setUserInfo(userinfo: UserInfo) {
      userInfo.value = userinfo
    }
    async function getUserInfo() {
      const res = await getUser()
      setUserInfo(res)
      return res
    }
    async function login(userInfo: userLoginInfo) {
      const { username, password } = userInfo
      const res = await loginApi({
        username,
        password: md5(password),
      })
      setTimeStamp()
      token.value = res.token
    }
    async function logout() {
      token.value = ''
      userInfo.value = {}

      router.push('/login')
    }
    return { login, token, getUserInfo, userInfo, logout }
  },
  {
    persist: {
      pick: ['token', 'userInfo'],
    },
  },
)
