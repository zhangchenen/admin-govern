<template>
  <div class="space-y-5">
    <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="mb-1 text-sm font-semibold text-[var(--app-primary-text)]">
          {{ $t('msg.excel.sectionLabel') }}
        </p>
        <h1 class="text-2xl font-semibold tracking-tight text-foreground">
          {{ $t('msg.excel.pageTitle') }}
        </h1>
        <p class="mt-1 max-w-2xl text-sm leading-6 text-muted">
          {{ $t('msg.excel.pageDescription') }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <el-button type="primary" @click="openImportPage">
          {{ $t('msg.excel.importExcel') }}
        </el-button>
        <el-button type="success" @click="exportDialogVisible = true">
          {{ $t('msg.excel.exportExcel') }}
        </el-button>
      </div>
    </header>

    <el-card
      class="rounded-xl border border-border bg-surface shadow-sm [&>.el-card__body]:p-3 sm:[&>.el-card__body]:p-5"
    >
      <div class="overflow-x-auto">
        <el-table
          v-loading="loading"
          :aria-busy="loading"
          :data="userList"
          border
          :empty-text="$t('msg.excel.empty')"
          class="min-w-[1040px] [&_th.el-table__cell]:bg-page [&_th.el-table__cell]:font-semibold [&_th.el-table__cell]:text-foreground"
        >
          <el-table-column :label="$t('msg.role.index')" type="index" width="72" />
          <el-table-column prop="username" :label="$t('msg.excel.name')" min-width="150" />
          <el-table-column prop="mobile" :label="$t('msg.excel.mobile')" min-width="150" />
          <el-table-column :label="$t('msg.excel.avatar')" align="center" width="100">
            <template #default="{ row }">
              <el-image class="h-11 w-11 rounded-full" :src="row.avatar" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('msg.excel.role')" min-width="180">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1.5">
                <el-tag v-for="role in row.role" :key="role.id ?? role.title" size="small">
                  {{ role.title }}
                </el-tag>
                <el-tag v-if="!row.role?.length" size="small">
                  {{ $t('msg.excel.defaultRole') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('msg.excel.openTime')" min-width="160">
            <template #default="{ row }">
              {{ $filter.dateFilter(row.openTime) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('msg.excel.action')" width="250" align="center">
            <template #default="{ row }">
              <div class="flex flex-wrap items-center justify-center gap-1">
                <el-button type="primary" size="small" @click="openUserInfo(row._id)">
                  {{ $t('msg.excel.show') }}
                </el-button>
                <el-button type="info" size="small" @click="openRoleDialog(row)">
                  {{ $t('msg.excel.showRole') }}
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">
                  {{ $t('msg.excel.remove') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination
        class="mt-5 flex flex-wrap justify-end gap-y-2"
        :current-page="page"
        :page-size="size"
        :page-sizes="[2, 5, 10, 20]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <Export2Excel v-model="exportDialogVisible" />
    <RolesDialog
      v-model="roleDialogVisible"
      :user-id="selectedUserId"
      @update-role="onRoleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Export2Excel from './components/Export2Excel.vue'
import RolesDialog from './components/roles.vue'
import { getUserManageList, type ManageList } from '@/api/user-manage'
import { deleteUser } from '@/api/user-manage'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { watchSwitchLang } from '@/utils/i18n'
defineOptions({ name: 'UserManageView' })

const router = useRouter()

const userList = ref<ManageList[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const loading = ref(false)
const exportDialogVisible = ref(false)
const roleDialogVisible = ref(false)
const selectedUserId = ref('')
const { t } = useI18n({ useScope: 'global' })
async function getUserList(page: number, size: number): Promise<void> {
  loading.value = true
  try {
    const result = await getUserManageList({ page, size })
    userList.value = result.list
    total.value = result.total
  } catch {
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}
function handleSizeChange(_size: number): void {
  size.value = _size
  page.value = 1
  void getUserList(page.value, size.value)
}

function handleCurrentChange(_page: number): void {
  page.value = _page
  void getUserList(page.value, size.value)
}

async function handleDelete(user: ManageList): Promise<void> {
  try {
    await ElMessageBox.confirm(
      `${t('msg.excel.dialogTitle1')}${user.username}${t('msg.excel.dialogTitle2')}`,
      t('msg.excel.tips'),
      {
        confirmButtonText: t('msg.excel.remove'),
        cancelButtonText: t('msg.excel.close'),
        type: 'warning',
      },
    )
    await deleteUser(user._id)
    ElMessage.success(t('msg.excel.removeSuccess'))
    if (userList.value.length === 1 && page.value > 1) page.value -= 1
    await getUserList(page.value, size.value)
  } catch (error) {
    if (error === 'cancel' || error === 'close') ElMessage.info(t('msg.excel.removeCancel'))
  }
}

function openImportPage(): void {
  void router.push('/user/import')
}

function openUserInfo(id: string): void {
  void router.push(`/user/info/${id}`)
}

function openRoleDialog(user: ManageList): void {
  selectedUserId.value = user._id
  roleDialogVisible.value = true
}

function onRoleUpdated(): void {
  void getUserList(page.value, size.value)
}

onMounted(() => {
  void getUserList(page.value, size.value)
})

watchSwitchLang(() => {
  void getUserList(page.value, size.value)
})
</script>
