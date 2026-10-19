import i18n from '@/i18n'
import { resolveRoutePath } from '@/utils/route'
import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export interface FuseRouteData {
  path: string
  title: string[]
}

export const generateRoutes = (
  routes: (RouteRecordNormalized | RouteRecordRaw)[] = [],
  basePath = '/',
  prefixTitle: string[] = [],
): FuseRouteData[] => {
  let result: FuseRouteData[] = []

  for (const route of routes) {
    const data = {
      path: resolveRoutePath(basePath, route.path),
      title: [...prefixTitle],
    }

    // 匹配/xxxx:id这种带params参数的路由
    const re = /.*\/:.*/
    const routeTitle = route.meta?.title
    if (typeof routeTitle === 'string' && routeTitle && !re.test(route.path)) {
      const i18ntitle = i18n.global.t(`msg.route.${routeTitle}`)
      data.title = [...data.title, i18ntitle]
      result.push(data)
    }
    if (route.children) {
      const tempRoutes = generateRoutes(route.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        result = [...result, ...tempRoutes]
      }
    }
  }

  return result
}
