<template>
  <div class="relative w-full h-full min-w-0 bg-page p-6 text-foreground max-[640px]:p-4">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path"></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'appMain',
})
import { useTagViewStore } from '@/stores/app'
import { generateTitle, watchSwitchLang } from '@/utils/i18n'
import { isTags } from '@/utils/tags'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const getTitle = (route: { path: string; meta?: unknown }) => {
  const meta = route.meta
  if (meta && typeof meta === 'object' && 'title' in meta && typeof meta.title === 'string') {
    return generateTitle(meta.title)
  }
  return route.path.split('/').pop() ?? ''
}
const route = useRoute()
const tagViewStore = useTagViewStore()
watch(
  route,
  (to) => {
    if (!isTags(to.path)) return
    const { fullPath, meta, name, params, path, query } = to
    tagViewStore.addTagsViewList({
      fullPath,
      meta,
      name: typeof name === 'string' ? name : path,
      params,
      path,
      query,
      title: getTitle(to),
    })
  },
  { immediate: true },
)
watchSwitchLang(() => {
  tagViewStore.tagsViewList.forEach((route, index) => {
    tagViewStore.changeTagsView({
      index,
      tag: {
        ...route,
        title: getTitle(route),
      },
    })
  })
})
</script>
<style lang="scss" scoped>
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
