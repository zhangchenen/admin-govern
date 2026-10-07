<template>
  <el-breadcrumb class="relative inline-block text-[14px] leading-[50px] ml-[8px] mr-[auto]!">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="item.path">
        <router-link
          v-if="index < breadcrumbData.length - 1"
          :to="getBreadcrumbTarget(item)"
          class="breadcrumb-link"
        >
          {{ item.meta?.title }}
        </router-link>
        <span v-else class="breadcrumb-current" aria-current="page">
          {{ item.meta?.title }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'BreadCrumb',
})
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteRecordNormalized } from 'vue-router'
const route = useRoute()
const breadcrumbData = ref<RouteRecordNormalized[]>([])
const getBreadcrumbTarget = (item: RouteRecordNormalized) => {
  const firstChild = item.children.find((child) => child.meta.title)
  return firstChild?.path ?? item.path
}
const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter((item) => item.meta && item.meta.title)
}
watch(
  route,
  () => {
    getBreadcrumbData()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.breadcrumb-move {
  transition: transform 0.3s ease;
}

.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb-link,
.breadcrumb-current {
  color: var(--app-on-primary);
}

.breadcrumb-link {
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--app-on-primary) 68%, transparent);
  text-underline-offset: 4px;
}

.breadcrumb-link:hover,
.breadcrumb-link:focus-visible,
.breadcrumb-link:active {
  color: var(--app-on-primary);
}

.breadcrumb-link:hover {
  text-decoration-color: var(--app-on-primary);
  text-decoration-thickness: 2px;
}

.breadcrumb-link:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--app-on-primary);
  outline-offset: 3px;
}

.breadcrumb-current {
  cursor: default;
  font-weight: 600;
}

:deep(.el-breadcrumb__separator) {
  color: color-mix(in srgb, var(--app-on-primary) 62%, transparent);
}
</style>
