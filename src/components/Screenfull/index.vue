<template>
  <div>
    <svg-icon
      id="guide-full"
      :icon="!isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="toggleFullscreen"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import screenfull from 'screenfull'
defineOptions({
  name: 'ScreenfullButton',
})
const isFullscreen = ref(false)
const change = () => {
  isFullscreen.value = !isFullscreen.value
}
const toggleFullscreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  }
}
onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', change)
  }
})
onUnmounted(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', change)
  }
})
</script>
<style lang="scss" scoped></style>
