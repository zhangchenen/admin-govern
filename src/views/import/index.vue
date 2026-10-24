<template>
  <el-card class="user-import">
    <template #header>
      <div class="user-import__header">
        <span>{{ $t('msg.excel.importExcel') }}</span>
        <el-button link @click="goBack">{{ $t('msg.universal.cancel') }}</el-button>
      </div>
    </template>

    <p class="user-import__description">选择或拖入 Excel 文件，导入后返回用户管理列表。</p>
    <UploadExcel @success="handleUploadSuccess" />
  </el-card>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UploadExcel from '@/components/UploadExcel/index.vue'
import type { ParsedExcelData } from '@/components/UploadExcel/utils'
import { userBatchImport } from '@/api/user-manage'
import { USER_RELATIONS } from './utils'

defineOptions({ name: 'UserImportView' })

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

type UserRelationKey = keyof typeof USER_RELATIONS

function isUserRelationKey(key: string): key is UserRelationKey {
  return Object.prototype.hasOwnProperty.call(USER_RELATIONS, key)
}

function goBack(): void {
  void router.push('/user/manage')
}

function generateData(results: Record<string, unknown>[]): Record<string, unknown>[] {
  return results.map((item) => {
    const userInfo: Record<string, unknown> = {}

    Object.keys(item).forEach((key) => {
      if (!isUserRelationKey(key)) return

      const field = USER_RELATIONS[key]
      userInfo[field] = field === 'openTime' ? formatExcelDate(item[key]) : item[key]
    })

    return userInfo
  })
}

function formatExcelDate(value: unknown): unknown {
  if (typeof value !== 'number' || !Number.isFinite(value)) return value

  const timestamp = Date.UTC(1899, 11, 30) + value * 24 * 60 * 60 * 1000
  const date = new Date(timestamp)
  if (!Number.isFinite(timestamp) || Number.isNaN(date.getTime())) return value

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function handleUploadSuccess({ results }: ParsedExcelData): Promise<void> {
  const updateData = generateData(results)
  await userBatchImport(updateData)
  ElMessage.success({
    message: results.length + t('msg.excel.importSuccess'),
    type: 'success',
  })
  void router.push('/user/manage')
}
</script>

<style lang="scss" scoped>
.user-import {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }

  &__description {
    color: var(--app-text-secondary);
    line-height: 1.6;
  }
}
</style>
