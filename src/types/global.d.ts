declare module 'md5'
declare module 'virtual:svg-icons-register'

declare module 'file-saver' {
  export function saveAs(data: Blob, filename?: string): void
}

declare module 'vue3-print-nb' {
  import type { Plugin } from 'vue'

  const printPlugin: Plugin
  export default printPlugin
}
