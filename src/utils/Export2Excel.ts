/**
 * 浏览器端表格导出工具。
 *
 * 数据流：页面整理二维数组 → 生成工作表 → 放入工作簿 → 序列化为文件字节 → 触发下载。
 *
 * 页面负责决定“导出哪些字段、字段顺序、字典名称、日期和角色如何展示”；
 * 此处负责把整理后的数据写成文件，因此不同列表页可以复用同一套导出流程。
 * 例如角色原本是对象数组，页面应先把它转换成“管理员、员工”这样的字符串再传入。
 */

// file-saver 负责触发浏览器下载；它不负责把数据转换成 Excel 格式。
import { saveAs } from 'file-saver'
// SheetJS（xlsx）负责在 JavaScript 数据、工作表和工作簿文件之间进行转换。
import * as XLSX from 'xlsx'

/**
 * 单元格允许接收的值。
 * 保留 number / boolean / Date 类型，让 SheetJS 根据值的类型生成单元格；
 * 若提前统一转成字符串，数字等内容就会成为文本，影响 Excel 中的计算与排序。
 * null 和 undefined 用来表达空值；对象、数组需由调用方先转换成可展示的内容。
 */
export type ExcelCellValue = string | number | boolean | Date | null | undefined

/** 导出参数：必填项确定表格内容，可选项控制文件名称、布局和文件格式。 */
export interface ExportExcelOptions {
  /**
   * 普通表头，例如 ['姓名', '联系方式']。
   * 数组顺序就是导出列顺序，必须与 data 中每行的值一一对应。
   */
  header: string[]
  /**
   * 表格正文，外层数组表示所有行，内层数组表示一行的各列。
   * 例如 [['张三', '13800138000'], ['李四', '13900139000']]。
   * 手机号、身份证号等标识信息宜传字符串，以保留前导零并避免长数字精度丢失。
   */
  data: ExcelCellValue[][]
  /** 文件名主体，默认 excel-list；工具会自动追加 bookType 对应的扩展名。 */
  filename?: string
  /**
   * 工作表标签名称，默认 Sheet1，与下载文件名是两个概念。
   * 调用方应提供合法名称；这里未处理 Excel 对工作表名称的长度、字符等限制。
   */
  sheetName?: string
  /**
   * 放在普通表头上方的附加行，可用于总标题、多级表头。
   * 例如 [['员工信息', '']] 会在 header 上面增加一行；单元格合并需另外配置 merges。
   */
  multiHeader?: ExcelCellValue[][]
  /**
   * 需要合并的区域，使用 Excel 的 A1 地址，例如 ['A1:B1']。
   * 地址按最终工作表计算，包含 multiHeader 和 header 占用的行，行号从 1 开始。
   * 合并区域应把要展示的内容放在左上角，其余位置宜留空，避免内容被合并遮住。
   */
  merges?: string[]
  /** 是否按各列内容估算列宽，默认 true；false 时不设置工作表的列宽信息。 */
  autoWidth?: boolean
  /**
   * SheetJS 支持的输出文件类型，默认 xlsx，同时决定序列化格式和文件扩展名。
   * 不同格式的能力不同，例如 CSV 不能保留单元格合并和列宽等 Excel 布局信息。
   */
  bookType?: XLSX.BookType
}

/**
 * 估算内容需要多少个“字符宽度”，供自动列宽使用。
 *
 * 这是便于阅读的近似算法：常见英文、数字计 1，中文等编码值大于 255 的字符计 2。
 * 它没有测量字体的实际像素宽度，特殊符号、表情和不同字体的宽度可能与估算有差异。
 */
function displayWidth(value: ExcelCellValue): number {
  // 使用 == null 同时识别 null 和 undefined，给空单元格一个基础宽度。
  // 不能写成 !value：数字 0 和布尔值 false 也是需要正常展示的有效内容。
  if (value == null) return 10

  // String 仅用于测量显示长度，不会改变后面传给 SheetJS 的原始单元格值。
  // Array.from 按 Unicode 码点拆分字符串，比直接 split('') 更适合遍历含表情的文本；
  // 这里的宽度判断仍是近似值，不等同于完整的 Unicode 排版宽度计算。
  // reduce 从 0 开始累加，也使空字符串的测量结果自然为 0。
  return Array.from(String(value)).reduce(
    (width, character) => width + (character.charCodeAt(0) > 255 ? 2 : 1),
    0,
  )
}

/** 根据整张表的内容，为每一列生成 SheetJS 需要的列宽配置。 */
function getColumnWidths(rows: ExcelCellValue[][]): XLSX.ColInfo[] {
  // 各行可能长度不同，取最长一行的列数，避免漏掉其他行中出现的列。
  // 额外传入 0，让 rows 为空时结果也是 0；否则 Math.max(...[]) 会得到 -Infinity。
  const columnCount = Math.max(0, ...rows.map((row) => row.length))

  // Array.from 的长度就是列数；每次遍历处理一列，结果数组与工作表列顺序对应。
  // wch 是 SheetJS 以字符宽度为单位的列宽字段，并非 CSS 的像素宽度。
  // 对当前列扫描所有行，取最大显示宽度，并设置至少 10 的下限，防止短内容列过窄。
  // 某一行没有这一列时，row[columnIndex] 为 undefined，会走空值的基础宽度。
  // rows 中也包含表头，所以表头比正文长时同样能撑开列宽。
  // 当前实现没有按合并区域分摊标题宽度，长标题可能使其所在的第一列偏宽。
  return Array.from({ length: columnCount }, (_, columnIndex) => ({
    wch: Math.max(10, ...rows.map((row) => displayWidth(row[columnIndex]))),
  }))
}

/**
 * 将表头和已转换为二维数组的数据导出为文件，并触发浏览器下载。
 *
 * 函数名中的 Json 指 JavaScript 数据；此接口实际接收的是二维数组，
 * 因而使用 aoa_to_sheet（Array of Arrays），并不直接接收后端返回的对象列表。
 * 对象列表应由页面先按选定字段提取成数组，保证表头与每一行的列顺序一致。
 *
 * @example
 * exportJsonToExcel({
 *   header: ['姓名', '联系方式'],
 *   data: [['张三', '13800138000']],
 *   filename: '员工名单',
 *   sheetName: '员工',
 *   multiHeader: [['员工信息', '']],
 *   merges: ['A1:B1'],
 * })
 * // 第 1 行是合并的“员工信息”，第 2 行是普通表头，第 3 行起是正文。
 *
 * @returns 无返回值。调用时同步生成文件内容并发起下载，
 * 不代表用户已经在保存对话框中完成文件保存。
 */
export function exportJsonToExcel(options: ExportExcelOptions): void {
  // 通过解构提供统一默认值，调用方通常只需传 header、data 和 filename。
  // multiHeader / merges 默认空数组，便于后面直接展开或检查长度。
  // 解构默认值仅在参数缺失或为 undefined 时生效，空字符串不会自动采用默认值。
  const {
    header,
    data,
    filename = 'excel-list',
    sheetName = 'Sheet1',
    multiHeader = [],
    merges = [],
    autoWidth = true,
    bookType = 'xlsx',
  } = options

  // 按“附加标题行 → 普通表头 → 正文”的顺序组装最终表格。
  // 展开语法创建新的外层数组，避免用 unshift 等操作向调用方的 data 中插入表头。
  // 这是浅拷贝，内层行数组仍共享引用；本函数后续不直接修改这些行数组。
  const rows: ExcelCellValue[][] = [...multiHeader, header, ...data]
  // aoa_to_sheet 按行、列下标生成 A1、B1 等单元格地址，并创建工作表对象。
  // 工作表只描述一张表的单元格和布局，还不是可供下载的整个 Excel 文件。
  const worksheet = XLSX.utils.aoa_to_sheet(rows)

  if (merges.length > 0) {
    // 以 ! 开头的这些属性是 SheetJS 的工作表配置，不是普通单元格地址。
    // decode_range 把 'A1:B1' 转成包含起止坐标的对象，内部行列下标从 0 开始。
    // !merges 接收的是这些区域对象组成的数组，不能直接赋值字符串数组。
    worksheet['!merges'] = merges.map((range) => XLSX.utils.decode_range(range))
  }

  if (autoWidth) {
    // !cols 的第 0 项对应 A 列，第 1 项对应 B 列，以此类推。
    // 传入最终 rows，让附加标题、普通表头和正文都参与宽度估算。
    worksheet['!cols'] = getColumnWidths(rows)
  }

  // 工作簿是工作表的容器，一个 Excel 文件可以包含多张工作表。
  // 先创建工作簿，再把刚生成的工作表按 sheetName 挂进去，才能序列化整个文件。
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  // bookType 决定实际文件格式；type: 'array' 指定输出 ArrayBuffer 形式的二进制内容。
  // 文件字节可以直接交给 Blob，不需要先转成 Base64 再做额外解码。
  const content = XLSX.write(workbook, { bookType, type: 'array' })
  // 去掉文件名首尾空白，再把路径分隔符和常见文件名非法字符替换为下划线。
  // 使用 g 全局替换，确保多个非法字符都被处理；处理后为空时再次使用默认文件名。
  // 这里只做常见字符清理，并未覆盖所有操作系统对保留名称、长度等规则的限制。
  const safeFilename = filename.trim().replace(/[\\/:*?"<>|]/g, '_') || 'excel-list'

  // Blob 把生成的字节包装成浏览器可处理的文件内容，saveAs 负责触发保存流程。
  // 扩展名与上面的 bookType 保持一致，避免实际内容是 xlsx，文件名却写成另一种格式。
  // filename 应传不带扩展名的主体，例如“员工名单”；此处会统一追加“.xlsx”等后缀。
  saveAs(new Blob([content]), `${safeFilename}.${bookType}`)
}
