<template>
  <aside
    aria-label="侧边导航"
    class="flex h-screen min-h-[32rem] flex-col bg-sidebar text-sidebar-text"
  >
    <div :class="`flex h-[${logHeight}] items-center justify-center p-[15px_0px_22px_0]!`">
      <el-avatar
        :size="isOpensideBar ? 70 : 50"
        shape="square"
        src="/img/watermarked_img_13306041170525843588.jpg"
      />
      <h1
        class="ml-[10px]! text-sidebar-text font-semibold leading-[50px] text-[16px] whitespace-nowrap"
        v-if="isOpensideBar"
      >
        imooc
      </h1>
    </div>
    <el-scrollbar><sidebarMenu> </sidebarMenu> </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
import sidebarMenu from './sidebarMenu.vue'
import { useApp } from '@/stores/store.js'
import { ref, computed } from 'vue'
const logHeight = ref(100)
const AppInfo = useApp()
const isOpensideBar = computed(() => AppInfo.sidebarOpen)
defineOptions({
  name: 'AdminSidebar',
})
</script>
