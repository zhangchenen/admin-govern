import * as XLSX from 'xlsx'

export interface ParsedExcelData {
  header: string[]
  results: Record<string, unknown>[]
}

/** 取工作表首行作为表头，空白单元格转换为空字符串。 */
export function getHeaderRow(worksheet: XLSX.WorkSheet): string[] {
  if (!worksheet['!ref']) return []

  const range = XLSX.utils.decode_range(worksheet['!ref'])
  const headers: string[] = []

  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: column })]
    headers.push(cell?.v == null ? '' : String(cell.v))
  }

  return headers
}

/** 判断文件名是否为教程支持的表格格式。 */
export function isExcel(file: File): boolean {
  return /\.(xlsx|xls|csv)$/i.test(file.name)
}
export function readerData(rawFile: File): Promise<ParsedExcelData> {
  return new Promise<ParsedExcelData>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const data = reader.result
        if (!(data instanceof ArrayBuffer)) {
          reject(new Error('无法读取 Excel 文件内容'))
          return
        }

        const workbook = XLSX.read(data, { type: 'array' })

        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          reject(new Error('Excel 文件中没有工作表'))
          return
        }

        const worksheet = workbook.Sheets[firstSheetName]
        if (!worksheet) {
          reject(new Error('无法读取 Excel 工作表'))
          return
        }

        const excelData: ParsedExcelData = {
          header: getHeaderRow(worksheet),
          results: XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet),
        }
        resolve(excelData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(reader.error ?? new Error('读取 Excel 文件失败'))
    }

    reader.onabort = () => {
      reject(new Error('读取 Excel 文件已取消'))
    }

    reader.readAsArrayBuffer(rawFile)
  })
}
export function generateData(
  excelData: ParsedExcelData,
  onSuccess: (data: ParsedExcelData) => void,
): void {
  onSuccess(excelData)
}
