<template>
  <el-menu :unique-opened="true" default-active="4" class="sidebar-menu">
    <el-sub-menu index="1">
      <template #title
        ><el-icon><Location /></el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="4">
      <el-icon><Setting /></el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts"></script>
<style scoped>
.sidebar-menu {
  /* 透明菜单透出外层主题背景；悬停只叠加一层黑色，不覆盖成白色。 */
  --el-menu-bg-color: transparent;
  --el-menu-text-color: var(--app-sidebar-text);
  --el-menu-active-color: var(--app-sidebar-text);
  --el-menu-hover-bg-color: var(--app-sidebar-hover);
  border-right: none;
}

/* scoped 默认只影响当前组件；deep 用来访问 Element Plus 内部的菜单项。 */
.sidebar-menu :deep(.el-menu-item:not(.is-disabled):hover),
.sidebar-menu :deep(.el-sub-menu:not(.is-disabled) > .el-sub-menu__title:hover) {
  background-color: var(--app-sidebar-hover);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: var(--app-sidebar-active);
  font-weight: 600;
}

.sidebar-menu :deep(.el-menu-item.is-active:not(.is-disabled):hover) {
  background-color: var(--app-sidebar-active-hover);
}

.sidebar-menu :deep(.el-menu-item:focus-visible),
.sidebar-menu :deep(.el-sub-menu__title:focus-visible) {
  outline: 2px solid var(--app-sidebar-text);
  outline-offset: -3px;
}

.sidebar-menu :deep(.el-icon) {
  color: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-menu :deep(.el-menu-item),
  .sidebar-menu :deep(.el-sub-menu__title) {
    transition: none;
  }
}
</style>
