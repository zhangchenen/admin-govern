<template>
  <div @click="toggleClick" class="p-[0px_16px]">
    <svg-icon
      class="inline-block align-middle w-[20px] h-[20px]"
      :icon="icon"
      id="guide-hamburger"
    ></svg-icon>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'HamburgerMenu',
})
import { computed } from 'vue'
import { useApp } from '@/stores/store'
const appState = useApp()
const toggleClick = appState.triggerSidebarOpened
const icon = computed(() => {
  return appState.sidebarOpen ? 'hamburger-opened' : 'hamburger-closed'
})
</script>
