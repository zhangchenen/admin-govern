import type { App } from 'vue'
import print from 'vue3-print-nb'

export default (app: App): void => {
  app.use(print)
}
