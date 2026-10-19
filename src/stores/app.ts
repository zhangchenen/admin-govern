import { LANG } from '@/constant'
import { getItem, setItem } from '@/utils/storage'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { tag } from '@/types/apptype'
import type {} from 'pinia-plugin-persistedstate'

export type Language = 'zh' | 'en'
export const useLangStore = defineStore('lang', () => {
  const language = ref<Language>(getItem(LANG) === 'en' ? 'en' : 'zh')
  const setLanguage = (lang: Language) => {
    setItem(LANG, lang)
    language.value = lang
  }

  return { language, setLanguage }
})
export const useTagViewStore = defineStore(
  'tagsView',
  () => {
    const tagsViewList = ref<Array<tag>>([])
    const addTagsViewList = (tag: tag) => {
      const isFind = tagsViewList.value.find((item: tag) => {
        return item.path === tag.path
      })
      if (!isFind) {
        tagsViewList.value.push(tag)
      }
    }
    const changeTagsView = ({ index, tag }: { index: number; tag: tag }) => {
      tagsViewList.value[index] = tag
    }
    const removeTagsView = (payload: { type: 'index' | 'other' | 'right'; index: number }) => {
      if (payload.type === 'index') {
        tagsViewList.value.splice(payload.index, 1)
        return
      } else if (payload.type === 'other') {
        tagsViewList.value.splice(payload.index + 1, tagsViewList.value.length - payload.index + 1)
        tagsViewList.value.splice(0, payload.index)
      } else if (payload.type === 'right') {
        tagsViewList.value.splice(payload.index + 1, tagsViewList.value.length - payload.index)
      }
    }

    return { tagsViewList, addTagsViewList, changeTagsView, removeTagsView }
  },
  {
    persist: {
      pick: ['tagsViewList'],
    },
  },
)
