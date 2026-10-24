<template>
  <section class="flex min-h-0 flex-col gap-5">
    <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="mb-1 text-sm font-semibold text-[var(--app-primary-text)]">
          {{ $t('msg.permission.sectionLabel') }}
        </p>
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">
          {{ $t('msg.permission.pageTitle') }}
        </h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-muted">
          {{ $t('msg.permission.pageDescription') }}
        </p>
      </div>
      <div
        class="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm"
      >
        <span class="text-sm text-muted">{{ $t('msg.permission.totalPermissions') }}</span>
        <span class="text-xl font-semibold tabular-nums text-foreground">
          {{ permissionCount }}
        </span>
      </div>
    </header>

    <el-card
      class="min-h-0 flex-1 rounded-xl border border-border bg-surface shadow-sm [&>.el-card__body]:p-0"
    >
      <div class="overflow-x-auto rounded-xl">
        <el-table
          v-loading="loading"
          :aria-busy="loading"
          :data="allPermission"
          row-key="id"
          border
          default-expand-all
          :tree-props="treeProps"
          :empty-text="$t('msg.permission.empty')"
          class="w-full min-w-[720px] [&_th.el-table__cell]:bg-page [&_th.el-table__cell]:font-semibold [&_th.el-table__cell]:text-foreground"
        >
          <el-table-column prop="permissionName" :label="$t('msg.permission.name')" width="220" />
          <el-table-column prop="permissionMark" :label="$t('msg.permission.mark')" width="220" />
          <el-table-column prop="permissionDesc" :label="$t('msg.permission.desc')" min-width="280" />
        </el-table>
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { permissionList } from '@/api/permissionlist'
import { watchSwitchLang } from '@/utils/i18n'

defineOptions({ name: 'PermissionListView' })

type PermissionItem = Awaited<ReturnType<typeof permissionList>>[number]

// 一级权限对应页面权限，二级权限对应页面内的功能权限。
const allPermission = ref<PermissionItem[]>([])
const loading = ref(false)
const permissionCount = computed(() => {
  const countNodes = (items: PermissionItem[]): number =>
    items.reduce((count, item) => count + 1 + countNodes(item.children ?? []), 0)
  return countNodes(allPermission.value)
})
const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
}

async function getPermissionList(): Promise<void> {
  loading.value = true
  try {
    allPermission.value = await permissionList()
  } catch {
    allPermission.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void getPermissionList()
})

watchSwitchLang(() => {
  void getPermissionList()
})
</script>

<style lang="scss" scoped></style>
