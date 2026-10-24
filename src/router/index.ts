import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import Article from './modules/Article'
import ArticleCreate from './modules/ArticleCreate'
import PermissionList from './modules/PermissionList'
import RoleList from './modules/RoleList'
import UserManage from './modules/UserManage'
import { useUserStore } from '@/stores/user'
export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: layout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        meta: {
          title: 'profile',
          icon: 'personnel',
        },
      },
      {
        path: '/chart',
        name: 'chart',
        component: () => import(/* webpackChunkName: "chart" */ '@/views/chart/index.vue'),
        meta: {
          title: 'chart',
          icon: 'chart',
        },
      },
      {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "error-page" */ '@/views/error-page/404.vue'),
      },
      {
        path: '/401',
        name: '401',
        component: () => import(/* webpackChunkName: "error-page" */ '@/views/error-page/401.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
]
export function resetRouter() {
  const userStore = useUserStore()
  if (userStore.userInfo && userStore.userInfo.permission && userStore.userInfo.permission.menus) {
    const menus = userStore.userInfo.permission.menus
    menus.forEach((menu) => {
      router.removeRoute(menu)
    })
  }
}
export const privateRoutes: RouteRecordRaw[] = [
  Article,
  ArticleCreate,
  PermissionList,
  RoleList,
  UserManage,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes],
})

export default router
