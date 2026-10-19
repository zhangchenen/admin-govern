<template>
  <main class="min-w-0">
    <el-row>
      <el-col :xs="24" :lg="7">
        <ProjectCard class="mb-5 lg:mb-0" :features="featureData" :loading="featuresLoading" />
      </el-col>
      <el-col :xs="24" :lg="17">
        <el-card class="min-h-[420px] ml-[10px]!">
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('msg.profile.feature')" name="feature">
              <Feature :features="featureData" :loading="featuresLoading" />
            </el-tab-pane>
            <el-tab-pane :label="$t('msg.profile.chapter')" name="chapter">
              <Chapter />
            </el-tab-pane>
            <el-tab-pane :label="$t('msg.profile.author')" name="author">
              <Author />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ProfileFeature } from '@/api/profile'
import Author from './components/Author.vue'
import Chapter from './components/Chapter.vue'
import Feature from './components/Feature.vue'
import ProjectCard from './components/ProjectCard.vue'
import { getProfileFeatures } from '@/api/profile'
defineOptions({ name: 'ProfileView' })

const activeTab = ref('feature')
const featureData = ref<ProfileFeature[]>([])
const featuresLoading = ref(false)
onMounted(async () => {
  featuresLoading.value = true
  try {
    featureData.value = await getProfileFeatures()
  } catch {
    featureData.value = []
  } finally {
    featuresLoading.value = false
  }
})
// 手写练习：按 docs/chapter-06-handwrite-standard.md 接入功能数据请求。
</script>
