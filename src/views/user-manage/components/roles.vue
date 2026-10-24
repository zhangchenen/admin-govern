<template>
  <el-dialog
    :title="$t('msg.excel.roleDialogTitle')"
    :model-value="props.modelValue"
    width="min(560px, calc(100vw - 32px))"
    :close-on-click-modal="false"
    @close="closed"
  >
    <div
      v-loading="loading"
      :aria-busy="loading"
      class="min-h-36 rounded-xl border border-border bg-page p-3"
    >
      <el-alert
        v-if="loadFailed"
        :title="$t('msg.role.loadFailed')"
        type="error"
        :closable="false"
        show-icon
      >
        <template #default>
          <el-button link type="primary" :disabled="loading" @click="loadAssignmentData()">
            {{ $t('msg.universal.retry') }}
          </el-button>
        </template>
      </el-alert>
      <el-empty
        v-else-if="!loading && allRoleList.length === 0"
        :description="$t('msg.role.empty')"
        :image-size="72"
      />
      <el-checkbox-group
        v-else
        v-model="selectedRoleIds"
        class="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        <el-checkbox
          v-for="item in allRoleList"
          :key="item.id"
          :value="item.id"
          :disabled="loading || saving"
          class="!mr-0 min-h-11 rounded-lg border border-border bg-surface px-3 py-2 transition-colors hover:border-primary"
        >
          {{ item.title }}
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button :disabled="saving" @click="closed">
          {{ $t('msg.universal.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="loading || loadFailed || !hasLoadedAssignment"
          @click="onConfirm"
        >
          {{ $t('msg.universal.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { rolelist, type RoleList } from '@/api/role'
import { updateRole, userRoles } from '@/api/user-manage'
import { watchSwitchLang } from '@/utils/i18n'

defineOptions({ name: 'UserRolesDialog' })

interface Props {
  modelValue: boolean
  userId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'updateRole'): void
}>()

const allRoleList = ref<RoleList[]>([])
const selectedRoleIds = ref<string[]>([])
const loading = ref(false)
const saving = ref(false)
const hasLoadedAssignment = ref(false)
const loadFailed = ref(false)
const { t } = useI18n({ useScope: 'global' })
let requestVersion = 0

async function loadAssignmentData(preserveSelection = false): Promise<void> {
  const version = ++requestVersion
  const previousSelection = [...selectedRoleIds.value]
  loading.value = true
  loadFailed.value = false
  try {
    const [roles, result] = await Promise.all([rolelist(), userRoles(props.userId)])
    if (version !== requestVersion) return

    allRoleList.value = roles
    if (preserveSelection && hasLoadedAssignment.value) {
      const availableIds = new Set(roles.map((role) => role.id))
      selectedRoleIds.value = previousSelection.filter((id) => availableIds.has(id))
    } else {
      selectedRoleIds.value = result.role.flatMap((assignedRole) => {
        const match = assignedRole.id
          ? roles.find((role) => role.id === assignedRole.id)
          : roles.find((role) => role.title === assignedRole.title)
        return match ? [match.id] : []
      })
    }
    hasLoadedAssignment.value = true
  } catch {
    // 请求拦截器已显示接口错误；不要让失败结果被当作已分配角色提交。
    if (version === requestVersion) {
      allRoleList.value = []
      selectedRoleIds.value = []
      hasLoadedAssignment.value = false
      loadFailed.value = true
    }
  } finally {
    if (version === requestVersion) loading.value = false
  }
}

watch(
  () => [props.modelValue, props.userId] as const,
  ([visible, userId]) => {
    requestVersion += 1
    hasLoadedAssignment.value = false
    loadFailed.value = false
    selectedRoleIds.value = []
    if (visible && userId) void loadAssignmentData()
    else loading.value = false
  },
  { immediate: true },
)

watchSwitchLang(() => {
  if (props.modelValue && props.userId) void loadAssignmentData(true)
})

async function onConfirm(): Promise<void> {
  if (!props.userId || loading.value || saving.value) return

  const roles = selectedRoleIds.value.flatMap((id) => {
    const role = allRoleList.value.find((item) => item.id === id)
    return role ? [role] : []
  })

  saving.value = true
  try {
    await updateRole(props.userId, roles)
    ElMessage.success(t('msg.role.updateRoleSuccess'))
    closed()
    emit('updateRole')
  } catch {
    // 请求拦截器已展示接口错误；保留当前勾选，允许用户重试。
  } finally {
    saving.value = false
  }
}

function closed(): void {
  emit('update:modelValue', false)
}
</script>
