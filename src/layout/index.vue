<template>
  <div
    class="relative min-h-screen w-full bg-page text-foreground [--sidebar-width:240px] max-[1024px]:[--sidebar-width:200px] max-[640px]:[--sidebar-width:144px]"
  >
    <div class="fixed inset-y-0 left-0 z-20 w-[var(--sidebar-width)] overflow-y-auto bg-sidebar">
      <Sidebar></Sidebar>
    </div>
    <div class="ml-[var(--sidebar-width)] min-h-screen min-w-0">
      <div
        class="sticky top-0 z-10 min-h-16 bg-surface max-[640px]:[&_header]:flex-wrap max-[640px]:[&_header]:gap-2 max-[640px]:[&_header]:p-3"
      >
        <Navbar></Navbar>
      </div>
      <AppMain></AppMain>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Siderbar/index.vue'
import AppMain from './components/AppMain.vue'
defineOptions({
  name: 'AdminLayout',
})
</script>
