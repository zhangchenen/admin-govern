export interface tag {
  path: string
  title?: string
  fullPath?: string
  name?: string
  meta?: Record<string, unknown>
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}
