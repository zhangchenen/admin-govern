<template>
  <!-- 顶栏为主题操作提供一个固定入口，页面内容无需知道主题的实现细节。 -->
  <header
    class="absolute top-0 right-0 left-[var(--sidebar-width)] flex h-full min-h-14 items-center justify-end gap-3 border-b border-border bg-primary pr-6 pl-[5px] text-on-primary transition-[left] duration-[var(--sidebarduration)] ease-in-out"
  >
    <hamburger></hamburger>
    <bread-crumb></bread-crumb>
    <!-- label 把文字与颜色选择器关联，方便键盘和辅助技术识别。 -->
    <label for="theme-color-picker" class="text-sm text-muted text-on-primary">主题色</label>
    <!-- 关闭透明色与清除操作，Store 就只需处理不透明的六位十六进制色。 -->
    <el-color-picker
      id="theme-color-picker"
      aria-label="选择主题色"
      :model-value="themeStore.primaryColor"
      :predefine="presetColors"
      color-format="hex6"
      :clearable="false"
      @update:model-value="themeStore.setPrimaryColor"
    />
    <!-- 明暗模式与主色独立；用户可以在任一模式下保留自选颜色。 -->
    <button
      type="button"
      class="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-primary transition-colors hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      :aria-label="themeStore.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
      :title="themeStore.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
      @click="themeStore.toggleTheme()"
    >
      <el-icon :size="22" aria-hidden="true">
        <Sunny v-if="themeStore.theme === 'light'" />
        <Moon v-else />
      </el-icon>
    </button>
    <lang-select class="inline-block p-[0_18px_0_0] text-[24px] text-[var(--app-on-primary)] align-text-bottom cursor-pointer"></lang-select>
    <!-- 用户头像 -->
    <el-dropdown class="cursor-[pointer]" trigger="click" placement="bottom-end">
      <div class="relative mr-[6px]!">
        <el-avatar shape="square" :size="40" :src="avatar"> </el-avatar>
        <el-icon class="relative right-[10px]"><Tools /></el-icon>
      </div>
      <template #dropdown
        ><el-dropdown-menu>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <a href="" target="_blank"><el-dropdown-item divided> 课程主页 </el-dropdown-item> </a>
          <el-dropdown-item divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>
<script setup lang="ts">
// 所有主题状态与操作都来自同一个 Pinia Store，切换后其它组件自动联动。
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Moon, Sunny, Tools } from '@element-plus/icons-vue'
import hamburger from '@/components/hamburger.vue'
import BreadCrumb from '@/components/Breadcrumb/index.vue'
const { userInfo } = storeToRefs(useUserStore())
const avatar = computed(() => userInfo.value.avatar)
// 组件实例读取并调用 Store；不在 Navbar 内自行写 localStorage 或 DOM。
const themeStore = useThemeStore()
// 预设色方便快速尝试，颜色选择器仍允许输入任意合法颜色。
const presetColors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#db2777']
// 使用多词组件名，既方便 Vue DevTools 定位，也满足项目的命名规则。
defineOptions({
  name: 'AdminNavbar',
})
</script>
