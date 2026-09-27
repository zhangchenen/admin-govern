import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './permission'
import './assets/main.css'
import './style/index.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const app = createApp(App)
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)

app.mount('#app')
