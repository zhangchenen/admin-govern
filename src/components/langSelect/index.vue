<template>
  <el-dropdown trigger="click" @command="handleSetLanguage">
    <div>
      <el-tooltip content="国际化" :effect="effect">
        <svg-icon icon="language"></svg-icon>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en"> 英文 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useLangStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'LanguageSelect' })
const { effect } = defineProps({
  effect: {
    type: String,
    default: 'dark',
    validator: function (value: string): boolean {
      return ['dark', 'light'].indexOf(value) !== -1
    },
  },
})
const langinfo = useLangStore()
const i18n = useI18n({ useScope: 'global' })
const language = computed(() => langinfo.language)
const handleSetLanguage = (lang: string) => {
  if (lang !== 'zh' && lang !== 'en') return
  langinfo.setLanguage(lang)
  i18n.locale.value = lang
  ElMessage.success('切换语言成功')
}
</script>
