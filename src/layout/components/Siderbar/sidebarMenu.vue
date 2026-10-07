<template>
  <el-menu
    :unique-opened="true"
    :default-active="activeMenu"
    class="sidebar-menu"
    router
    :collapse="!isSidebarOpen"
  >
    <sidebar-item v-for="item in routes" :key="item.path" :route="item"> </sidebar-item>
  </el-menu>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { filterRouters, generateMenus } from '@/utils/route'
import sidebarItem from './sidebarItem.vue'
import { useApp } from '@/stores/store.js'
const router = useRouter()

const routes = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())

  return generateMenus(filterRoutes)
})
const isSidebarOpen = computed(() => {
  const app = useApp()
  return app.sidebarOpen
})
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>
<style scoped>
.sidebar-menu {
  /* 透明菜单透出外层主题背景；悬停只叠加一层黑色，不覆盖成白色。 */
  --el-menu-bg-color: transparent;
  --el-menu-text-color: var(--app-sidebar-text);
  --el-menu-active-color: var(--app-sidebar-text);
  --el-menu-hover-bg-color: var(--app-sidebar-hover);
  border-right: none;
}

/* scoped 默认只影响当前组件；deep 用来访问 Element Plus 内部的菜单项。 */
.sidebar-menu :deep(.el-menu-item:not(.is-disabled):hover),
.sidebar-menu :deep(.el-sub-menu:not(.is-disabled) > .el-sub-menu__title:hover) {
  background-color: var(--app-sidebar-hover);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: var(--app-sidebar-active);
  font-weight: 600;
}

.sidebar-menu :deep(.el-menu-item.is-active:not(.is-disabled):hover) {
  background-color: var(--app-sidebar-active-hover);
}

.sidebar-menu :deep(.el-menu-item:focus-visible),
.sidebar-menu :deep(.el-sub-menu__title:focus-visible) {
  outline: 2px solid var(--app-sidebar-text);
  outline-offset: -3px;
}

.sidebar-menu :deep(.el-icon) {
  color: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-menu :deep(.el-menu-item),
  .sidebar-menu :deep(.el-sub-menu__title) {
    transition: none;
  }
}
</style>
