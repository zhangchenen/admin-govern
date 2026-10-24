<template>
  <section class="flex min-h-0 flex-col gap-5">
    <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="mb-1 text-sm font-semibold text-[var(--app-primary-text)]">
          {{ $t('msg.role.sectionLabel') }}
        </p>
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">
          {{ $t('msg.role.pageTitle') }}
        </h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-muted">
          {{ $t('msg.role.pageDescription') }}
        </p>
      </div>
      <div
        class="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm"
      >
        <span class="text-sm text-muted">{{ $t('msg.role.totalRoles') }}</span>
        <span class="text-xl font-semibold tabular-nums text-foreground">
          {{ allRoles.length }}
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
          :data="allRoles"
          row-key="id"
          border
          :empty-text="$t('msg.role.empty')"
          class="w-full min-w-[640px] [&_th.el-table__cell]:bg-page [&_th.el-table__cell]:font-semibold [&_th.el-table__cell]:text-foreground"
        >
          <el-table-column :label="$t('msg.role.index')" type="index" width="88" />
          <el-table-column :label="$t('msg.role.name')" prop="title" min-width="180" />
          <el-table-column :label="$t('msg.role.desc')" prop="describe" min-width="240" />
          <el-table-column :label="$t('msg.role.action')" width="190" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="onDistributePermissionClick(row)">
                {{ $t('msg.role.assignPermissions') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <DistributePermission
      v-model="distributePermissionVisible"
      :role-id="selectRoleId"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DistributePermission from './components/DistributePermission.vue'
import { rolelist, type RoleList } from '@/api/role'
import { watchSwitchLang } from '@/utils/i18n'

defineOptions({ name: 'RoleListView' })

const allRoles = ref<RoleList[]>([])
const loading = ref(false)
const distributePermissionVisible = ref(false)
const selectRoleId = ref('')

async function getRoleList(): Promise<void> {
  loading.value = true
  try {
    allRoles.value = await rolelist()
  } catch {
    allRoles.value = []
  } finally {
    loading.value = false
  }
}

function onDistributePermissionClick(row: RoleList): void {
  selectRoleId.value = row.id
  distributePermissionVisible.value = true
}

watchSwitchLang(() => {
  void getRoleList()
})

onMounted(() => {
  void getRoleList()
})
</script>

<style lang="scss" scoped></style>
