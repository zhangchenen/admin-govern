<template>
  <div>
    <svg-icon
      icon="search"
      id="guide-search"
      @click.stop="onShowClick"
      :class="isShow ? '' : 'cursor-pointer text-[18px] align-middle'"
    />
    <el-select
      ref="headerSearchSelect"
      class="text-[18px] transition-[width] duration-200 overflow-hidden background-[transparent] rounded-[0] inline-block align-middle header-search"
      :class="isShow ? 'w-[210px] ml-[10px]' : 'w-0'"
      filterable
      clearable
      v-model="search"
      default-first-option
      remote
      :placeholder="$t('msg.navBar.headerSearch')"
      :remote-method="querySearch"
      @change="onSelectChange"
    >
      <el-option
        v-for="option in searchOptions"
        :key="option.item.path"
        :label="option.item.title.join('>')"
        :value="option.item"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SelectInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { filterRouters } from '@/utils/route'
import { generateRoutes, type FuseRouteData } from '@/compositions/HeaderSearch/FuseData'
import { watchSwitchLang } from '@/utils/i18n'
import Fuse, { type FuseResult } from 'fuse.js'
defineOptions({
  name: 'HeaderSearch',
})
const isShow = ref(false)
const headerSearchSelectRef = ref<SelectInstance | null>(null)
const onShowClick = () => {
  isShow.value = !isShow.value
  headerSearchSelectRef.value?.focus()
}
const search = ref('')
const searchOptions = ref<FuseResult<FuseRouteData>[]>([])
const router = useRouter()
const createFuse = () => {
  const filterRoutes = filterRouters(router.getRoutes())
  return new Fuse(generateRoutes(filterRoutes), {
    shouldSort: true,
    threshold: 0.4,
    minMatchCharLength: 1,
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'path', weight: 0.3 },
    ],
  })
}
let fuse = createFuse()

const querySearch = (query: string) => {
  if (query !== '') {
    searchOptions.value = fuse.search(query)
  } else {
    searchOptions.value = []
  }
}
const onSelectChange = (value: FuseRouteData | null) => {
  if (value) router.push(value.path)
}
const onClose = () => {
  headerSearchSelectRef.value?.blur()
  isShow.value = false
  searchOptions.value = []
  search.value = ''
}
watch(isShow, (val) => {
  if (val) {
    document.body.addEventListener('click', onClose)
  } else {
    document.body.removeEventListener('click', onClose)
  }
})
watchSwitchLang(() => {
  fuse = createFuse()
})
</script>
<style scoped>
@reference "../../assets/main.css";

.header-search :deep(.el-input__inner) {
  @apply rounded-none border-x-0 border-t-0 border-b border-[#d9d9d9] px-0 shadow-none! align-middle;
}
</style>
