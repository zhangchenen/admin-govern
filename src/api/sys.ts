import request from '@/utils/request'
import type { userLoginInfo } from '@/views/login/type'
import type { LoginResult } from '@/types/api'
export const login = (data: userLoginInfo) => {
  return request<LoginResult>({
    url: '/sys/login',
    method: 'post',
    data,
  })
}
