<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
const elementLocal = computed(() => {
  return locale.value === 'zh' ? zhCn : en
})
</script>

<template>
  <el-config-provider :locale="elementLocal">
    <div class="h-[100vh] w-[100%]">
      <router-view />
    </div>
  </el-config-provider>
</template>

<style scoped></style>
