import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './permission'
import './assets/main.css'
import './style/variables.scss'
import './style/index.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useThemeStore } from './stores/theme'
const app = createApp(App)
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
useThemeStore()
app.use(router)

app.mount('#app')
