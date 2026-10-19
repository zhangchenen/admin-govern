<template>
  <div class="min-h-48">
    <el-skeleton v-if="loading" :rows="3" animated />
    <el-empty v-else-if="features.length === 0" :description="$t('msg.profile.emptyFeature')" />
    <el-collapse v-else v-model="activeName" accordion>
      <el-collapse-item v-for="item in features" :key="item.id" :title="item.title" :name="item.id">
        <div class="profile-feature-content" v-html="item.content"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileFeature } from '@/api/profile'

defineOptions({ name: 'ProfileFeatureList' })

defineProps<{
  features: ProfileFeature[]
  loading?: boolean
}>()

const activeName = ref<string | number>('')
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  font-weight: 600;
}

:deep(.profile-feature-content a) {
  margin: 0 4px;
  color: var(--el-color-primary);
}
</style>
