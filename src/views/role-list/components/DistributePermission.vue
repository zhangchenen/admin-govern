<template>
  <el-dialog
    :model-value="props.modelValue"
    :title="$t('msg.role.assignPermissionTitle')"
    width="min(560px, calc(100vw - 32px))"
    :close-on-click-modal="false"
    @close="closed"
  >
    <div class="space-y-3">
      <p class="text-sm leading-6 text-muted">
        {{ $t('msg.permission.assignHelp') }}
      </p>
      <el-alert
        v-if="loadFailed"
        :title="$t('msg.permission.loadFailed')"
        type="error"
        :closable="false"
        show-icon
      >
        <template #default>
          <el-button link type="primary" :disabled="loading" @click="loadRolePermissions()">
            {{ $t('msg.universal.retry') }}
          </el-button>
        </template>
      </el-alert>
      <div
        v-loading="loading"
        :aria-busy="loading"
        class="max-h-[55vh] min-h-40 overflow-y-auto rounded-xl border border-border bg-page p-2"
      >
        <el-tree
          ref="treeRef"
          :key="props.roleId"
          :data="allPermission"
          :props="treeProps"
          node-key="id"
          show-checkbox
          check-strictly
          default-expand-all
          :empty-text="$t('msg.permission.empty')"
          class="bg-transparent text-foreground [&_.el-tree-node__content]:h-10 [&_.el-tree-node__content]:rounded-md [&_.el-tree-node__content:hover]:bg-surface"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button :disabled="saving" @click="closed">
          {{ $t('msg.universal.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :loading="saving"
          :disabled="loading || loadFailed"
          @click="onConfirm"
        >
          {{ $t('msg.universal.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { permissionList, type PermissionItem } from '@/api/permissionlist'
import { distributePermission, rolePermission } from '@/api/role'
import { watchSwitchLang } from '@/utils/i18n'

interface Props {
  modelValue: boolean
  roleId: string
}

interface PermissionTreeRef {
  getCheckedKeys(): Array<string | number>
  setCheckedKeys(keys: Array<string | number>): void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n({ useScope: 'global' })
const allPermission = ref<PermissionItem[]>([])
const treeRef = ref<PermissionTreeRef | null>(null)
const loading = ref(false)
const saving = ref(false)
const loadFailed = ref(false)
let requestVersion = 0

const treeProps = {
  children: 'children',
  label: 'permissionName',
}

async function loadRolePermissions(): Promise<void> {
  if (!props.modelValue || !props.roleId) return
  const version = ++requestVersion
  loading.value = true
  loadFailed.value = false
  try {
    const [permissionTree, checkedKeys] = await Promise.all([
      permissionList(),
      rolePermission(props.roleId),
    ])
    if (version !== requestVersion) return

    allPermission.value = permissionTree
    await nextTick()
    if (version === requestVersion) {
      treeRef.value?.setCheckedKeys(checkedKeys)
    }
  } catch {
    // 请求拦截器已展示接口错误；失败时禁止提交，避免清空角色原权限。
    if (version === requestVersion) {
      allPermission.value = []
      loadFailed.value = true
    }
  } finally {
    if (version === requestVersion) loading.value = false
  }
}

watch(
  () => [props.modelValue, props.roleId] as const,
  ([visible, roleId]) => {
    requestVersion += 1
    loadFailed.value = false
    if (visible && roleId) void loadRolePermissions()
    else {
      allPermission.value = []
      loading.value = false
    }
  },
  { immediate: true },
)

watchSwitchLang(() => {
  if (!props.modelValue) return
  if (loading.value) {
    void loadRolePermissions()
    return
  }
  const checkedKeys = treeRef.value?.getCheckedKeys().map(String) ?? []
  const version = ++requestVersion
  loading.value = true
  void permissionList()
    .then(async (permissions) => {
      if (version !== requestVersion) return
      allPermission.value = permissions
      await nextTick()
      if (version === requestVersion) treeRef.value?.setCheckedKeys(checkedKeys)
    })
    .catch(() => {
      // 请求拦截器负责呈现错误消息。
    })
    .finally(() => {
      if (version === requestVersion) loading.value = false
    })
})

async function onConfirm(): Promise<void> {
  if (!props.roleId || loading.value || loadFailed.value || saving.value) return

  saving.value = true
  try {
    await distributePermission({
      roleId: props.roleId,
      permissions: treeRef.value?.getCheckedKeys().map(String) ?? [],
    })
    ElMessage.success(t('msg.role.updatePermissionSuccess'))
    closed()
  } catch {
    // 请求拦截器已展示接口错误；留在弹窗中，允许用户重试。
  } finally {
    saving.value = false
  }
}

function closed(): void {
  emit('update:modelValue', false)
}
</script>
