import request from '@/utils/request'

export interface RoleList {
  describe: string
  id: string
  title: string
}

export interface DistributePermissionPayload {
  roleId: string
  permissions: string[]
}

export const rolelist = () => {
  return request<RoleList[]>({
    url: '/role/list',
  })
}

export const rolePermission = (roleId: string) => {
  return request<string[]>({
    url: `/role/permission/${encodeURIComponent(roleId)}`,
  })
}

export const distributePermission = (data: DistributePermissionPayload) => {
  return request<unknown>({
    url: '/role/distribute-permission',
    method: 'POST',
    data,
  })
}
