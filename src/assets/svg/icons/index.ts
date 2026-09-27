import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import type { App } from 'vue'
import 'virtual:svg-icons-register'
export default {
  install(app: App) {
    app.component('svg-icon', SvgIcon)
  },
}
