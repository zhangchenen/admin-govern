<template>
  <div
    class="h-[34px] w-[calc(100%_-_var(--sidebar-width))] absolute right-0 border-b border-[#d8dce5] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.12),0_0_3px_0_rgba(0,0,0,0.04)]"
  >
    <el-scrollbar>
      <router-link
        v-for="(tag, index) in tagsViewList"
        :key="tag.fullPath"
        :to="{ path: tag.fullPath }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        :style="{
          backgroundColor: isActive(tag) ? 'var(--app-primary)' : '',
          borderColor: isActive(tag) ? 'var(--app-border)' : '',
        }"
        @contextmenu.prevent="openMenu($event, index)"
      >
        {{ tag.title }}
        <svg-icon
          icon="close"
          @click.prevent.stop="onCloseClick(index)"
          class="inline-block size-4 origin-[100%_50%] align-[2px] rounded-full text-center leading-[10px] transition-all duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#b4bccc] hover:text-white"
        ></svg-icon>
      </router-link>
    </el-scrollbar>
    <context-menu v-show="visible" :style="menuStyle" :index="selectIndex"></context-menu>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'TagsView',
})
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useTagViewStore } from '@/stores/app'
import ContextMenu from './ContextMenu.vue'
import { ref, reactive, watch } from 'vue'

import type { tag } from '@/types/apptype'
const selectIndex = ref(0)
const visible = ref(false)
const menuStyle = reactive({
  left: '0',
  top: '0',
})
const route = useRoute()
const { tagsViewList } = storeToRefs(useTagViewStore())
const isActive = (tag: tag) => {
  return tag.path === route.path
}
const { removeTagsView } = useTagViewStore()
const onCloseClick = (index: number) => {
  removeTagsView({ type: 'index', index })
}
const openMenu = (e: MouseEvent, index: number) => {
  const { x, y } = e
  menuStyle.left = x + 'px'
  menuStyle.top = y + 'px'
  selectIndex.value = index
  visible.value = true
}
const closeMenu = () => {
  visible.value = false
}
watch(visible, (val) => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
</script>
<style lang="css" scoped>
@reference "../../assets/main.css";

.tags-view-item {
  @apply relative mt-1 ml-[5px] inline-block h-[26px] cursor-pointer
    border border-[#d8dce5] bg-white px-2 text-xs leading-[26px]
    text-[#495060] first-of-type:ml-[15px] last-of-type:mr-[15px];
}

.tags-view-item.active {
  @apply border-sidebar bg-sidebar text-white;
}

.tags-view-item.active::before {
  @apply relative mr-1 inline-block size-2 rounded-full bg-white;
  content: '';
}
</style>
