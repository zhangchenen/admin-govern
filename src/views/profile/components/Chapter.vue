<template>
  <div class="min-h-48">
    <el-skeleton v-if="loading" :rows="3" animated />
    <el-empty v-else-if="chapters.length === 0" :description="$t('msg.profile.emptyChapter')" />
    <el-timeline v-else>
      <el-timeline-item
        v-for="item in chapters"
        :key="item.id"
        :timestamp="item.timestamp"
        placement="top"
      >
        <el-card>
          <h3 class="font-semibold">{{ item.content }}</h3>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProfileChapterTimeline' })

import { onMounted, ref } from 'vue'
import type { ProfileChapter } from '@/api/profile'
import { getProfileChapters } from '@/api/profile'
const chapters = ref<ProfileChapter[]>([])
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    chapters.value = await getProfileChapters()
  } catch {
    chapters.value = []
  } finally {
    loading.value = false
  }
})

// 手写练习：按 docs/chapter-06-handwrite-standard.md 接入章节数据请求。
</script>
