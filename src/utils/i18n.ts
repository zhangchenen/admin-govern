import i18n from '@/i18n'
import { watch } from 'vue'
import { useLangStore } from '@/stores/app.ts'
export function generateTitle(title: string) {
  return i18n.global.t('msg.route.' + title)
}
export function watchSwitchLang(...cbs: Array<() => void>) {
  watch(
    () => useLangStore().language,
    () => {
      cbs.forEach((cb) => cb())
    },
  )
}
