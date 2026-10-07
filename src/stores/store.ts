import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useApp = defineStore('app', () => {
  const sidebarOpen = ref(true)
  function triggerSidebarOpened() {
    sidebarOpen.value = !sidebarOpen.value
  }
  return { sidebarOpen, triggerSidebarOpened }
})
