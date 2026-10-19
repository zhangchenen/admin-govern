<template>
  <div
    class="pan-thumb"
    :style="{
      width: `${prop.size}px`,
      height: `${prop.size}px`,
      borderRadius: prop.shape === 'square' ? 'var(--el-avatar-border-radius, 4px)' : '50%',
    }"
  >
    <div class="pan-thumb-inner">
      <div class="pan-thumb-front">
        <el-avatar v-bind="prop" />
      </div>
      <div class="pan-thumb-back">
        <div>{{ title }}</div>
        <div>{{ username }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PanThumbProps } from './panThumb.ts'
import { useUserStore } from '@/stores/user.ts'

defineOptions({ name: 'PanThumb' })

const prop = defineProps<PanThumbProps>()
const userStore = useUserStore()
const title = computed(() => userStore.userInfo.title)
const username = computed(() => userStore.userInfo.username)
</script>

<style scoped>
.pan-thumb {
  flex-shrink: 0;
  perspective: 800px;
}

.pan-thumb-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}

.pan-thumb:hover .pan-thumb-inner {
  transform: rotateY(180deg);
}

.pan-thumb-front,
.pan-thumb-back {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backface-visibility: hidden;
}

.pan-thumb-front .el-avatar {
  display: block;
}

.pan-thumb-back {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  overflow: hidden;
  color: var(--el-text-color-primary);
  text-align: center;
  overflow-wrap: anywhere;
  background: var(--el-fill-color-light);
  transform: rotateY(180deg);
}
</style>
