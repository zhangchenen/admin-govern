import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { isCheckTimeout } from './auth'
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    config.headers.icode = 'helloqianduanxunlianying'
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
      if (isCheckTimeout()) {
        userStore.logout()
        ElMessage.warning('用户登录过期，请重新登录')
        return Promise.reject(new Error('token失效'))
      }
    }

    return config
  },
  (error) => {
    const userStore = useUserStore()
    if (error.response && error.response.data && error.response.data.code === 401) {
      userStore.logout()
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response) => {
    const { message, success, data } = response.data
    if (success) {
      return data
    } else {
      ElMessage.error(message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  },
)

// 响应拦截器会返回后端响应体中的 data，而不是 AxiosResponse。
// Axios 的 AxiosInstance 类型不会自动推断拦截器的解包结果，因此在这里声明实际返回类型。
const request = <T = unknown>(config: AxiosRequestConfig): Promise<T> =>
  service.request(config) as unknown as Promise<T>

export default request
