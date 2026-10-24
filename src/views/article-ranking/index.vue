<template>
  <section class="flex min-w-0 flex-col gap-5 text-foreground">
    <el-card
      shadow="never"
      class="rounded-xl! [--el-card-bg-color:var(--app-surface)]! [--el-card-border-color:var(--app-border)]! [&>.el-card__body]:p-5!"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
        <span
          id="article-dynamic-title"
          class="shrink-0 text-sm leading-8 font-semibold text-foreground"
        >
          {{ $t('msg.article.dynamicTitle') }}
        </span>
        <el-checkbox-group
          v-model="selectDynamicLabel"
          aria-labelledby="article-dynamic-title"
          class="flex min-w-0 flex-wrap gap-x-5 gap-y-1 [&>.el-checkbox]:m-0!"
        >
          <el-checkbox v-for="item in dynamicData" :key="item.prop" :value="item.prop">
            {{ $t(item.labelKey) }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>

    <el-card
      shadow="never"
      class="min-w-0 rounded-xl! [--el-card-bg-color:var(--app-surface)]! [--el-card-border-color:var(--app-border)]! [&>.el-card__body]:p-5!"
    >
      <div class="overflow-x-auto">
        <el-table
          ref="tableRef"
          :data="tableData"
          row-key="_id"
          border
          :empty-text="$t('msg.article.empty')"
          class="w-full min-w-[800px] [--el-table-bg-color:var(--app-surface)]! [--el-table-tr-bg-color:var(--app-surface)]! [--el-table-text-color:var(--app-text)]! [--el-table-border-color:var(--app-border)]! [--el-table-header-bg-color:var(--app-page)]! [--el-table-header-text-color:var(--app-text)]! [--el-table-row-hover-bg-color:var(--app-primary-soft)]! [&_th.el-table__cell]:font-semibold [&_.el-table__row]:cursor-pointer [&_.sortable-ghost]:opacity-60 [&_.sortable-ghost>td.el-table__cell]:bg-primary! [&_.sortable-ghost>td.el-table__cell]:text-on-primary!"
        >
          <el-table-column
            v-for="item in tableColumns"
            :key="item.prop"
            :prop="item.prop"
            :label="$t(item.labelKey)"
            :min-width="item.minWidth"
          >
            <template v-if="item.prop === 'publicDate'" #default="{ row }">
              <!-- TODO 9-03：用你实现的相对时间方法替换，并响应语言切换。 -->
              {{ row.publicDate }}
            </template>
            <template v-else-if="item.prop === 'action'" #default="{ row }">
              <div class="flex flex-wrap gap-2 [&>.el-button]:m-0!">
                <el-button type="primary" size="small" @click="onShowClick(row)">
                  {{ $t('msg.article.show') }}
                </el-button>
                <el-button type="danger" size="small" @click="onRemoveClick(row)">
                  {{ $t('msg.article.remove') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-5! overflow-x-auto pb-1!">
        <el-pagination
          class="flex w-max min-w-full justify-center!"
          :current-page="page"
          :page-size="size"
          :page-sizes="[5, 10, 50, 100, 200]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'

defineOptions({ name: 'ArticleRankingView' })

type ArticleColumnKey = 'ranking' | 'title' | 'author' | 'publicDate' | 'desc' | 'action'

interface ArticleRow {
  _id: string
  ranking: number
  title: string
  author: string
  publicDate: string | number
  desc: string
}

interface ArticleColumn {
  prop: ArticleColumnKey
  labelKey: string
  minWidth: number
}

// 仅为模板准备静态列描述。显示文字在模板中翻译，勾选值始终使用稳定的 prop。
const dynamicData: ArticleColumn[] = [
  { prop: 'ranking', labelKey: 'msg.article.ranking', minWidth: 88 },
  { prop: 'title', labelKey: 'msg.article.title', minWidth: 180 },
  { prop: 'author', labelKey: 'msg.article.author', minWidth: 120 },
  { prop: 'publicDate', labelKey: 'msg.article.publicDate', minWidth: 160 },
  { prop: 'desc', labelKey: 'msg.article.desc', minWidth: 220 },
  { prop: 'action', labelKey: 'msg.article.action', minWidth: 160 },
]
const selectDynamicLabel = ref<ArticleColumnKey[]>([
  'ranking',
  'title',
  'author',
  'publicDate',
  'desc',
  'action',
])
// TODO 9-05～9-06：自行抽取 dynamic 模块，并根据勾选值生成实际展示的列。
// 当前是静态全列，仅改变勾选状态不会改变表格。
const tableColumns = ref<ArticleColumn[]>([...dynamicData])

const tableRef = ref<TableInstance | null>(null)
const tableData = ref<ArticleRow[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)

// TODO 9-02：自行编写列表请求、数据赋值、首次加载和 keep-alive 激活刷新。
// TODO 9-03：自行实现相对时间；后端业务内容的语言切换刷新也由你完成。
// TODO 9-09～9-10：自行初始化/销毁 Sortable，指定 ghostClass: 'sortable-ghost'，完成排序持久化。

function handleSizeChange(_currentSize: number): void {
  // TODO 9-02：更新 size/page 后重新获取列表。
  void _currentSize
}

function handleCurrentChange(_currentPage: number): void {
  // TODO 9-02：更新 page 后重新获取列表。
  void _currentPage
}

function onShowClick(_row: ArticleRow): void {
  // TODO 9-13：用文章 _id 跳转到现有的 /article/:id 路由。
  void _row
}

function onRemoveClick(_row: ArticleRow): void {
  // TODO 9-12：删除确认、调用接口、反馈结果并刷新列表。
  void _row
}
</script>
