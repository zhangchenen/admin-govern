/**
 * 导出表头与用户字段的对应关系，顺序决定导出列顺序。
 */
export const USER_RELATIONS = {
  姓名: 'username',
  联系方式: 'mobile',
  角色: 'role',
  开通时间: 'openTime',
} as const
