<template>
  <el-dialog
    :model-value="modelValue"
    :title="$t('msg.excel.title')"
    width="min(480px, calc(100vw - 32px))"
    @close="closed"
  >
    <el-input v-model="excelName" :placeholder="$t('msg.excel.placeholder')" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closed">{{ $t('msg.excel.close') }}</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm">
          {{ $t('msg.excel.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUserManageAllList, type ManageList } from '@/api/user-manage'
import type { ExcelCellValue } from '@/utils/Export2Excel'
import { watchSwitchLang } from '@/utils/i18n'
import { dateFormat } from '@/utils/date'
import { USER_RELATIONS } from './Export2ExcelConstants'
defineOptions({ name: 'Export2ExcelDialog' })

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()
let exportDefaultName = t('msg.excel.defaultName')
const excelName = ref(exportDefaultName)
watchSwitchLang(() => {
  exportDefaultName = t('msg.excel.defaultName')
  excelName.value = exportDefaultName
})

// 与参考项目一致：点击导出后，由弹窗完成请求、数据转换和文件下载。
const loading = ref(false)
const onConfirm = async (): Promise<void> => {
  loading.value = true
  try {
    const allUser = (await getUserManageAllList()).list
    const excel = await import('@/utils/Export2Excel')
    const data = formatJson(USER_RELATIONS, allUser)
    excel.exportJsonToExcel({
      header: Object.keys(USER_RELATIONS),
      data,
      filename: excelName.value.trim() || exportDefaultName,
      autoWidth: true,
      bookType: 'xlsx',
    })
    closed()
  } finally {
    // 请求或导出失败时也要恢复按钮，方便修改后重试。
    loading.value = false
  }
}
const formatJson = (
  headers: Record<string, keyof ManageList>,
  rows: ManageList[],
): ExcelCellValue[][] => {
  // 映射形如 { 姓名: 'username', 角色: 'role' }，值必须是用户对象中存在的字段。
  // 按映射中的字段顺序提取每一行，保证导出数据与表头顺序一致。
  return rows.map((item) => {
    return Object.keys(headers).map((key) => {
      // noUncheckedIndexedAccess 下，字符串索引的结果可能为 undefined。
      const field = headers[key]
      if (field === undefined) return undefined
      if (field === 'openTime') {
        return dateFormat(item[field])
      }
      if (field === 'role') {
        // 角色是对象数组，需先转换为字符串，才能作为普通 Excel 单元格的值。
        const roles = item[field]
        return JSON.stringify(roles.map((role) => role.title))
      }
      return item[field]
    })
  })
}

// 与参考项目一致：关闭时在组件内部复位 loading，再通知父组件隐藏弹窗。
const closed = (): void => {
  loading.value = false
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
