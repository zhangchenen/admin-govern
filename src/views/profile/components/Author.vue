<template>
  <article class="max-w-3xl">
    <header class="flex items-center gap-3">
      <el-avatar
        :size="60"
        src="https://img4.sycdn.imooc.com/61110c2b0001152907400741-140-140.jpg"
        :aria-label="$t('msg.profile.name')"
      />
      <div class="flex min-h-14 flex-col justify-around">
        <h2 class="text-lg font-semibold">{{ $t('msg.profile.name') }}</h2>
        <p class="text-sm text-muted">{{ $t('msg.profile.job') }}</p>
      </div>
    </header>
    <p class="mt-4 text-sm leading-6 indent-6">{{ $t('msg.profile.Introduction') }}</p>
  </article>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProfileAuthor' })
</script>
