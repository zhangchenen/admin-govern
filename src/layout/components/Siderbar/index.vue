<template>
  <aside
    aria-label="侧边导航"
    class="flex h-screen min-h-[32rem] w-full flex-col bg-sidebar text-sidebar-text"
  >
    <el-scrollbar><sidebarMenu> </sidebarMenu> </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import sidebarMenu from './sidebarMenu.vue'

defineOptions({
  name: 'AdminSidebar',
})
</script>
