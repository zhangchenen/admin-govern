// 用户信息的类
interface Permission {
  menus: Array<string>
  points: Array<string>
}
export interface userInfo {
  avatar?: string
  id: string
  permission: Permission
  role: unknown[]
  title?: string
  username?: string
  _id: string
}
