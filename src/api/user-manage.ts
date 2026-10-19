import request from '@/utils/request'
export interface ManageList {
  username: string
  mobile: string
  avatar: string
  role: Record<string, string>
  openTime: string
}
export interface ListParams {
  page: number
  size: number
}
export const getUserManageList = (data: ListParams) => {
  return request<Partial<ManageList>>({
    url: '/user-manage/list',
    params: data,
  })
}
