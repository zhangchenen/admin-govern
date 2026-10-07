<template>
  <i v-if="icon.includes('el-icon')" :class="icon"></i>
  <svg-icon :icon="icon" v-else></svg-icon>
  <span class="ml-[6px]!">{{ $t(`route.${title}`) }}</span>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
defineOptions({
  name: 'menuItem',
})
const { icon, title } = defineProps<{ icon: string; title: string }>()
</script>
