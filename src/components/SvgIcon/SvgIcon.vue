<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="size-[1em] align-[-0.15em] fill-[currentColor] overflow-hidden bg-[currentColor] mask-cover! inline-block"
    :class="className"
  ></div>
  <svg
    v-else
    aria-hidden="true"
    class="size-[1em] align-[-0.15em] fill-[currentColor] overflow-hidden"
    :class="className"
  >
    <use :xlink-href="iconName"></use>
  </svg>
</template>
<script lang="ts" setup>
import type { svgIconProps } from './SvgIcon'
import { isExternal as external } from '@/utils/validate'
import { computed } from 'vue'
const { icon, className = '' } = defineProps<svgIconProps>()
const isExternal = computed(() => external(icon))
const iconName = computed(() => `#icon-${icon}`)
const styleExternalIcon = computed(() => ({
  mask: `url(${icon}) no-repeat 50% 50%`,
  '-webkit-mask': `url(${icon}) no-repeat 50% 50%`,
}))
</script>
