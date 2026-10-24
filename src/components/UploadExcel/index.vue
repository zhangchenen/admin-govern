<template>
  <section class="upload-excel">
    <div class="upload-excel__toolbar">
      <el-button type="primary" :loading="loading" @click="handleUpload">
        {{ $t('msg.uploadExcel.upload') }}
      </el-button>
      <input
        ref="fileInput"
        class="upload-excel__input"
        type="file"
        accept=".xlsx,.xls,.csv"
        @change="handleFileChange"
      />
    </div>

    <div
      class="upload-excel__dropzone"
      @drop.stop.prevent="handleDrop"
      @dragover.stop.prevent="handleDragover"
      @dragenter.stop.prevent="handleDragover"
    >
      <el-icon :size="48"><UploadFilled /></el-icon>
      <span>{{ $t('msg.uploadExcel.drop') }}</span>
      <small>.xlsx / .xls / .csv</small>
    </div>
    <!-- 文件选择、拖拽校验和解析流程是本章手写练习，见下方 TODO。 -->
  </section>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import type { ParsedExcelData } from './utils'
import { readerData } from './utils'
import { generateData } from './utils'
defineOptions({ name: 'UploadExcel' })

const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const props = defineProps<{ beforeUpload?: (file: File) => boolean }>()
const emit = defineEmits<{
  success: [data: ParsedExcelData]
}>()

function handleUpload(): void {
  // TODO: 打开隐藏的文件选择框。
  fileInput.value?.click()
}

function handleFileChange(_event: Event): void {
  // TODO: 读取所选文件，完成格式校验并进入解析流程。
  let files: FileList | null = null
  const target = _event.currentTarget
  if (target instanceof HTMLInputElement) {
    files = target.files
  }
  const rawFile = files ? files[0] : null

  if (!rawFile) {
    return
  }
  upload(rawFile)
}
const upload = (rawFile: FileList[0]) => {
  const input = fileInput.value
  if (input) {
    input.value = ''
  }
  if (props.beforeUpload && !props.beforeUpload(rawFile)) return

  readerData(rawFile).then((excelData) => {
    generateData(excelData, (data) => emit('success', data))
  })
}
function handleDrop(_event: DragEvent): void {
  // TODO: 校验拖入文件数量和格式，再交给文件解析流程。
  let files
  if (_event.dataTransfer?.files) {
    files = _event.dataTransfer.files[0]
  }
  const extension = files?.name.split('.').filter((item) => {
    if (['xlsx', 'xls', 'csv'].includes(item.toLocaleLowerCase())) {
      return item
    }
  })

  extension?.length && files ? upload(files) : ''
}

function handleDragover(_event: DragEvent): void {
  // TODO: 设置拖拽放置效果。
  if (!_event.dataTransfer) return
  _event.dataTransfer.dropEffect = 'copy'
}
</script>

<style lang="scss" scoped>
.upload-excel {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 24px 0;

  &__toolbar,
  &__dropzone {
    display: flex;
    width: min(350px, 100%);
    min-height: 160px;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--app-border);
  }

  &__toolbar {
    position: relative;
  }

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  &__dropzone {
    flex-direction: column;
    gap: 10px;
    color: var(--app-text-secondary);
    text-align: center;
  }

  small {
    font-size: 12px;
  }
}
</style>
