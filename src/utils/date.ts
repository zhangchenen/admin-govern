import dayjs from 'dayjs'

/** 与参考项目一致：把数字或数字字符串形式的时间戳转换为日期，保留已有日期文本。 */
export const dateFormat = (value: string | number, format = 'YYYY-MM-DD'): string => {
  if (Number.isNaN(Number(value))) return String(value)
  return dayjs(Number.parseInt(String(value), 10)).format(format)
}
