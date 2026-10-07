<template>
  <!-- 自引用组件终止条件 -->
  <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
    <template #title>
      <menu-item :title="route.meta.title" :icon="route.meta.icon"></menu-item>
    </template>
    <sidebar-item v-for="item in route.children" :key="item.path" :route="item"></sidebar-item>
  </el-sub-menu>
  <!-- 自引用组件终止条件 -->
  <el-menu-item v-else :index="route.path">
    <menu-item :title="route.meta.title" :icon="route.meta.icon"></menu-item>
  </el-menu-item>
</template>
<script setup lang="ts">
import menuItem from './menuItem.vue'
import type { MenuRoute } from '@/utils/route'
defineOptions({
  name: 'SidebarItem',
})
const { route } = defineProps<{
  route: MenuRoute
}>()
</script>
