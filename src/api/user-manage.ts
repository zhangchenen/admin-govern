import request from '@/utils/request'

export interface UserRole {
  id?: string
  title: string
}

export interface ManageList {
  _id: string
  username: string
  mobile: string
  avatar: string
  role: UserRole[]
  openTime: string | number
}

export interface ListParams {
  page: number
  size: number
}

export interface UserManageListResult {
  list: ManageList[]
  total: number
}

export interface UserManageAllListResult {
  list: ManageList[]
}

export interface UserExperience {
  startTime: string | number
  endTime: string | number
  title: string
  desc: string
}

export interface UserDetail {
  username?: string
  gender?: string
  nationality?: string
  mobile?: string
  province?: string
  openTime?: string | number
  remark?: string[]
  address?: string
  avatar?: string
  experience?: UserExperience[]
  major?: string
  glory?: string
}

export interface BatchImportUser {
  [field: string]: unknown
}

export const getUserManageList = (data: ListParams) => {
  return request<UserManageListResult>({
    url: '/user-manage/list',
    params: data,
  })
}

/** 批量导入用户。字段映射由页面练习完成后传入。 */
export const userBatchImport = (data: BatchImportUser[]) => {
  return request<unknown>({
    url: '/user-manage/batch/import',
    method: 'POST',
    data,
  })
}

/** 删除接口路径沿用教程服务端的 `detele` 拼写。 */
export const deleteUser = (id: string) => {
  return request<unknown>({
    url: `/user-manage/detele/${encodeURIComponent(id)}`,
  })
}

export const getUserManageAllList = () => {
  return request<UserManageAllListResult>({
    url: '/user-manage/all-list',
  })
}

export const getUserDetail = (id: string) => {
  return request<UserDetail>({
    url: `/user-manage/detail/${encodeURIComponent(id)}`,
  })
}

export interface UserRolesResult {
  role: UserRole[]
}

/** 获取指定用户已分配的角色。 */
export const userRoles = (id: string) => {
  return request<UserRolesResult>({
    url: `/user-manage/role/${encodeURIComponent(id)}`,
  })
}

/** 更新指定用户的角色。 */
export const updateRole = (id: string, roles: UserRole[]) => {
  return request<unknown>({
    url: `/user-manage/update-role/${encodeURIComponent(id)}`,
    method: 'POST',
    data: { roles },
  })
}
