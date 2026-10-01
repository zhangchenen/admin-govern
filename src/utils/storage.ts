/**
 * 存储数据
 */
export const setItem = (key: string, value: unknown) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  const serialized = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)
  window.localStorage.setItem(key, serialized)
}

/**
 * 获取数据
 */
export const getItem = (key: string) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data ?? 'null')
  } catch (err) {
    return data
  }
}

/**
 * 删除数据
 */
export const removeItem = (key: string) => {
  window.localStorage.removeItem(key)
}

/**
 * 删除所有数据
 */
export const removeAllItem = (key: string) => {
  window.localStorage.clear()
}
