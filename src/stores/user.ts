import { defineStore } from 'pinia'
import { login as loginApi } from '@/api/sys'
import md5 from 'md5'
import type { userLoginInfo } from '@/views/login/type'
import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    async function login(userInfo: userLoginInfo) {
      const { username, password } = userInfo
      const res = await loginApi({
        username,
        password: md5(password),
      })
      token.value = res.token
    }
    return { login, token }
  },
  {
    persist: {
      pick: ['token'],
    },
  },
)
