<template>
  <div class="cursor-pointer">
    <el-tooltip :content="$t('msg.navBar.guide')">
      <svg-icon icon="guide" @click="onClick" id="guide-start"></svg-icon>
    </el-tooltip>
  </div>
</template>
<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useI18n } from 'vue-i18n'
import { onBeforeUnmount, onMounted } from 'vue'
import steps from './steps'
import { watchSwitchLang } from '@/utils/i18n'
defineOptions({ name: 'GuideTour' })
const i18n = useI18n()
let drivers: ReturnType<typeof driver> | null = null
const getDriverOptions = () => ({
  allowClose: false,
  closeBtnLabel: i18n.t('msg.guide.close'),
  nextBtnText: i18n.t('msg.guide.next'),
  prevBtnText: i18n.t('msg.guide.prev'),
})
const createDriver = () => driver(getDriverOptions())
const initDriver = () => {
  if (drivers) {
    drivers.setConfig(getDriverOptions())
  } else {
    drivers = createDriver()
  }
}
onMounted(initDriver)
watchSwitchLang(initDriver)
onBeforeUnmount(() => {
  drivers?.destroy()
  drivers = null
})
const onClick = () => {
  const activeDriver = drivers ?? (drivers = createDriver())
  activeDriver.setSteps(steps(i18n))
  activeDriver.drive()
}
</script>
<style scoped></style>
