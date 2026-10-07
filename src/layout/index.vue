<template>
  <div :class="normalClass">
    <div
      class="fixed inset-y-0 left-0 z-20 w-[var(--sidebar-width)] overflow-y-auto bg-sidebar transition-[width] duration-[var(--sidebarduration)] ease-in-out"
    >
      <Sidebar></Sidebar>
    </div>
    <!-- 顶栏容器占满页面，供绝对定位的 Navbar 固定右侧并改变 left。 -->
    <div
      class="sticky top-0 z-10 min-h-14 max-[640px]:min-h-28 max-[640px]:[&_header]:flex-wrap max-[640px]:[&_header]:gap-2 max-[640px]:[&_header]:p-3"
    >
      <Navbar></Navbar>
    </div>
    <div
      class="ml-[var(--sidebar-width)] min-h-screen min-w-0 transition-[margin-left] duration-[var(--sidebarduration)] ease-in-out"
    >
      <AppMain></AppMain>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Siderbar/index.vue'
import AppMain from './components/AppMain.vue'
import { useApp } from '@/stores/store'
import { computed } from 'vue'

defineOptions({
  name: 'AdminLayout',
})
const appInfo = useApp()
const normalClass = computed(() => {
  const baseClass = 'relative min-h-screen w-full bg-page text-foreground'
  const sidebarClass = appInfo.sidebarOpen
    ? '[--sidebar-width:240px] max-[1024px]:[--sidebar-width:200px] max-[640px]:[--sidebar-width:144px]'
    : '[--sidebar-width:var(--hidden-sidebar-width)]'

  return `${baseClass} ${sidebarClass}`
})
</script>
