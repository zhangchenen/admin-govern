import request from '@/utils/request'
import type { userLoginInfo } from '@/views/login/type'
import type { LoginResult } from '@/types/api'
import type { userInfo as UserInfo } from '@/types/entity'

export const login = (data: userLoginInfo) => {
  return request<LoginResult>({
    url: '/sys/login',
    method: 'post',
    data,
  })
}
export const getUserInfo = () => {
  return request<UserInfo>({
    url: '/sys/profile',
  })
}
