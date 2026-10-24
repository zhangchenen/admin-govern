import 'vue'
import type { Directive } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $filter: {
      dateFilter: (
        value: string | number | Date | null | undefined,
        format?: string,
      ) => string
    }
  }

  interface GlobalDirectives {
    vPrint: Directive<HTMLElement, unknown>
  }
}
