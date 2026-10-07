import type { RouteRecordNormalized } from 'vue-router'

export interface MenuRoute {
  path: string
  meta: {
    title: string
    icon: string
  }
  children: MenuRoute[]
}

// 返回所有子路由
const getChildrenRoutes = (routes: RouteRecordNormalized[]) => {
  const result: RouteRecordNormalized[] = []
  routes.forEach((route) => {
    if (route.children && route.children.length) {
      result.push(...route.children)
    }
  })
  return result
}
export function resolveRoutePath(basePath: string, routePath: string): string {
  if (routePath.startsWith('/')) return routePath

  return `${basePath.replace(/\/+$/, '')}/${routePath}`
}
// getRoutes() 的用途是列出所有已注册的路由记录，方便查询和管理路由，所以父路由、子路由都会作为数组中的独立项返回
// 所以要去除外层的子路由
export const filterRouters = (routes: RouteRecordNormalized[]) => {
  const childrenRoutes = getChildrenRoutes(routes)
  return routes.filter((route) => {
    return !childrenRoutes.find((childrenRoute) => {
      return childrenRoute.path === route.path
    })
  })
}
export function generateMenus(routes: RouteRecordNormalized[], basePath = ''): MenuRoute[] {
  const result: MenuRoute[] = []

  routes.forEach((item) => {
    const currentPath = resolveRoutePath(basePath, item.path)
    const title = item.meta.title
    const icon = item.meta.icon
    const hasMenuMeta = typeof title === 'string' && typeof icon === 'string'

    if (!hasMenuMeta) {
      result.push(...generateMenus(item.children, currentPath))
      return
    }

    let menuRoute = result.find((exist) => exist.path === currentPath)
    if (!menuRoute) {
      menuRoute = {
        path: currentPath,
        meta: { title, icon },
        children: [],
      }
      result.push(menuRoute)
    }

    menuRoute.children.push(...generateMenus(item.children, menuRoute.path))
  })

  return result
}
