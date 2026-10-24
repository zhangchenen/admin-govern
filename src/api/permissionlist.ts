import request from '@/utils/request'

export interface PermissionItem {
  id: string
  permissionDesc: string
  permissionMark: string
  permissionName: string
  children?: PermissionItem[]
  hasChildren?: boolean
}

export const permissionList = () => {
  return request<PermissionItem[]>({
    url: '/permission/list',
  })
}
