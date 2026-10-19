<template>
  <ul
    class="fixed bg-[#fff] z-3000 list-style-none p-[5px_0] rounded-[4px] text-[12px] font-[400] shadow-[2px_2px_3px_0_rgb(0,0,0,0.3)] [&>li]:cursor-pointer [&>li]:p-[7px_16px] [&>li]:m-0! [&>li:hover]:bg-[#eee] [&>li]:p-1!"
  >
    <li @click="onRefreshClick">{{ $t('msg.tagsView.refresh') }}</li>
    <li @click="onCloseRightClick">{{ $t('msg.tagsView.closeRight') }}</li>
    <li @click="onCloseOtherClick">{{ $t('msg.tagsView.closeOther') }}</li>
  </ul>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useTagViewStore } from '@/stores/app'
defineOptions({
  name: 'TagsViewContextMenu',
})
const { index } = defineProps<{ index: number }>()
const router = useRouter()
const onRefreshClick = () => {
  router.go(0)
}
const { removeTagsView } = useTagViewStore()
const onCloseRightClick = () => {
  removeTagsView({ type: 'right', index: index })
}
const onCloseOtherClick = () => {
  removeTagsView({ type: 'other', index })
}
</script>
<style lang="less" scoped></style>
