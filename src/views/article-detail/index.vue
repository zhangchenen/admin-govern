<template>
  <article
    class="min-w-0 rounded-xl border border-border bg-surface px-5! py-3! text-foreground sm:px-8!"
  >
    <h1 class="py-3! text-center text-[22px] leading-8 font-semibold break-words">
      {{ detail.title || $t('msg.route.articleDetail') }}
    </h1>

    <div class="flex flex-wrap items-center gap-x-5 gap-y-3 py-[26px]! text-sm text-muted">
      <span class="min-w-0 break-words">
        {{ $t('msg.article.author') }}{{ $t('msg.article.labelSeparator') }}{{ detail.author }}
      </span>
      <span class="min-w-0 break-words">
        <!-- TODO 9-03/9-13：接入你实现的相对时间与语言切换处理。 -->
        {{ $t('msg.article.publicDate') }}{{ $t('msg.article.labelSeparator')
        }}{{ detail.publicDate }}
      </span>
      <el-button type="primary" link class="ml-auto! shrink-0" @click="onEditClick">
        {{ $t('msg.article.edit') }}
      </el-button>
    </div>

    <!-- 这里只准备教程的正文展示容器。详情请求与 content 赋值留待练习。 -->
    <div class="border-t border-border py-5! text-sm leading-7">
      <div
        v-if="detail.content"
        class="break-words [&_a]:text-[var(--app-primary-text)] [&_a]:underline! [&_blockquote]:my-4! [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4! [&_blockquote]:text-muted [&_h1]:my-4! [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-4! [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:my-3! [&_h3]:text-lg [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:my-1! [&_ol]:my-3! [&_ol]:list-decimal [&_ol]:pl-6! [&_p]:my-3! [&_pre]:my-4! [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-page [&_pre]:p-4! [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:border [&_td]:border-border [&_td]:px-3! [&_td]:py-2! [&_th]:border [&_th]:border-border [&_th]:bg-page [&_th]:px-3! [&_th]:py-2! [&_ul]:my-3! [&_ul]:list-disc [&_ul]:pl-6!"
        v-html="detail.content"
      ></div>
      <el-empty v-else :description="$t('msg.article.emptyContent')" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'ArticleDetailView' })

interface ArticleDetail {
  title: string
  author: string
  publicDate: string | number
  content: string
}

const detail = ref<ArticleDetail>({ title: '', author: '', publicDate: '', content: '' })

// TODO 9-13：从路由读取文章 id，自行实现详情请求和 detail 赋值。
// TODO 9-13：语言切换/缓存激活时如何刷新业务内容，由你实现。
function onEditClick(): void {
  // TODO 第十章：完成创建文章后，再实现跳转到 /article/editor/:id。
}
</script>
