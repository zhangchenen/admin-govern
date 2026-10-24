import { defineStore } from 'pinia'
import { privateRoutes, publicRoutes } from '@/router'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])

  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = [...publicRoutes, ...newRoutes]
  }
  function filterRoutes(menus: string[]) {
    const routes: RouteRecordRaw[] = []
    menus.forEach((key: string) => {
      routes.push(...privateRoutes.filter((item) => item.name === key))
    })
    routes.push({
      path: '/:catchAll(.*)',
      redirect: '/404',
    })
    setRoutes(routes)
    return routes
  }
  return { routes, setRoutes, filterRoutes }
})
