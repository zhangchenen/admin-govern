const whiteList = ['/login', '/import', '/404', '/401']
export function isTags(path: string) {
  return !whiteList.includes(path)
}
