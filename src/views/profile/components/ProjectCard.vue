<template>
  <el-card class="h-full">
    <template #header>
      <div class="font-semibold">{{ $t('msg.profile.introduce') }}</div>
    </template>

    <div class="flex flex-col items-center">
      <!-- <el-avatar :size="100" :src="userInfo.avatar" :aria-label="userInfo.username">
        {{ userInfo.username?.slice(0, 1) }}
      </el-avatar> -->
      <panThumb :size="100" :src="userInfo.avatar as string"></panThumb>
      <div class="pt-3 text-center">
        <div class="font-semibold">{{ userInfo.username }}</div>
        <div class="pt-2 text-sm text-muted">{{ userInfo.title }}</div>
      </div>
    </div>

    <div class="mt-6 text-muted">
      <section class="mb-8">
        <h3 class="mb-2 border-b border-border pb-2 font-semibold text-foreground">
          <svg-icon icon="introduce" class="mr-1" />
          {{ $t('msg.profile.projectIntroduction') }}
        </h3>
        <p class="text-sm">{{ $t('msg.profile.muted') }}</p>
      </section>

      <section>
        <h3 class="mb-2 border-b border-border pb-2 font-semibold text-foreground">
          <svg-icon icon="reward" class="mr-1" />
          {{ $t('msg.profile.projectFunction') }}
        </h3>
        <el-skeleton v-if="loading" :rows="2" animated />
        <el-empty
          v-else-if="features.length === 0"
          :image-size="60"
          :description="$t('msg.profile.emptyFeature')"
        />
        <div v-else class="space-y-3">
          <div v-for="item in features" :key="item.id">
            <div class="mb-1 text-sm">{{ item.title }}</div>
            <el-progress :percentage="item.percentage" status="success" />
          </div>
        </div>
      </section>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { ProfileFeature } from '@/api/profile'
import panThumb from '@/components/PanThumb/index.vue'
defineProps<{
  features: ProfileFeature[]
  loading?: boolean
}>()

const { userInfo } = storeToRefs(useUserStore())
</script>
