import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getOnPrimaryColor, getSidebarPalette } from '@/utils/themeColors'

// 明暗模式决定页面底色，主题色决定按钮、链接等强调色，两者可以独立组合。
type Theme = 'light' | 'dark'
// 没有保存过颜色，或保存的数据无效时，回到项目原来的蓝色。
export const DEFAULT_PRIMARY_COLOR = '#2563eb'

// 只接受不透明的六位十六进制颜色，避免透明色让文字与背景无法稳定对比。
const HEX_COLOR = /^#[0-9a-f]{6}$/i

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 启动脚本已提前恢复 dark 类，Store 从 DOM 读取初始状态以避免闪回浅色。
    const theme = ref<Theme>(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    // 启动脚本也会提前写入主色；没有历史记录时采用默认蓝色。
    const primaryColor = ref(
      document.documentElement.style.getPropertyValue('--app-primary') || DEFAULT_PRIMARY_COLOR,
    )
    // 监听明暗状态：html.dark 会触发普通 CSS 和 Element Plus 的暗色变量。
    watch(
      theme,
      (value) => {
        document.documentElement.classList.toggle('dark', value === 'dark')
      },
      {
        immediate: true,
        flush: 'sync',
      },
    )
    // 监听主色：只更新变量入口，Tailwind、应用样式和 Element Plus 衍生色会自动重新计算。
    watch(
      primaryColor,
      (value) => {
        // 持久化内容可能被手动改坏，应用到 CSS 前再次校验。
        const safeColor = HEX_COLOR.test(value) ? value : DEFAULT_PRIMARY_COLOR
        // 内联变量覆盖样式表中的默认值，让用户自选颜色即时生效。
        document.documentElement.style.setProperty('--app-primary', safeColor)
        // 亮色主题色用黑字，深色主题色用白字，保持主按钮文字可读。
        document.documentElement.style.setProperty('--app-on-primary', getOnPrimaryColor(safeColor))
        // Element Plus 部分组件会单独读取 RGB 形式，也要同步三个颜色通道。
        const rgb = [1, 3, 5].map((start) => Number.parseInt(safeColor.slice(start, start + 2), 16))
        document.documentElement.style.setProperty('--el-color-primary-rgb', rgb.join(', '))
      },
      // 同步执行可避免一次颜色变化之后短暂显示旧样式。
      { immediate: true, flush: 'sync' },
    )
    // 侧边栏同时受主色和明暗模式影响；写入 CSS 变量后，组件自动更新。
    watch(
      [primaryColor, theme],
      ([color, mode]) => {
        const palette = getSidebarPalette(
          HEX_COLOR.test(color) ? color : DEFAULT_PRIMARY_COLOR,
          mode === 'dark',
        )
        const root = document.documentElement
        root.style.setProperty('--app-sidebar-bg', palette.background)
        root.style.setProperty('--app-sidebar-text', palette.text)
        root.style.setProperty('--app-sidebar-hover', palette.hover)
        root.style.setProperty('--app-sidebar-active', palette.active)
        root.style.setProperty('--app-sidebar-active-hover', palette.activeHover)
      },
      { immediate: true, flush: 'sync' },
    )
    // 所有主题切换都通过 Store，组件只需调用方法，不直接操作 DOM。
    function setTheme(value: Theme) {
      theme.value = value
    }
    // 根据当前明暗状态切换到另一种模式。
    function toggleTheme() {
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }
    // 颜色选择器可能传入空值；无效输入不会进入持久化状态。
    function setPrimaryColor(value: string | null) {
      if (value && HEX_COLOR.test(value)) primaryColor.value = value.toLowerCase()
    }
    // 暴露状态和操作，让 Navbar 等组件共用同一份主题状态。
    return { theme, primaryColor, setTheme, toggleTheme, setPrimaryColor }
  },
  {
    // Pinia 插件保存用户选择；刷新时会自动还原这两个字段。
    persist: {
      pick: ['theme', 'primaryColor'],
    },
  },
)
