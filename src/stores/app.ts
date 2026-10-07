import { LANG } from '@/constant'
import { getItem, setItem } from '@/utils/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export type Language = 'zh' | 'en'
export const useLangStore = defineStore('lang', () => {
  const language = ref<Language>(getItem(LANG) === 'en' ? 'en' : 'zh')
  const setLanguage = (lang: Language) => {
    setItem(LANG, lang)
    language.value = lang
  }
  return { language, setLanguage }
})
