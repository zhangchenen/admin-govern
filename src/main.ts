import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './style/index.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)

app.mount('#app')
