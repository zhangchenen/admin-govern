import dayjs from 'dayjs'
import type { App } from 'vue'

type DateValue = string | number | Date | null | undefined

const dateFilter = (value: DateValue, format = 'YYYY-MM-DD') => {
  const isNumericString =
    typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
  const date = isNumericString ? Number.parseInt(value, 10) : value
  return dayjs(date).format(format)
}

export default (app: App) => {
  app.config.globalProperties.$filter = {
    dateFilter,
  }
}
