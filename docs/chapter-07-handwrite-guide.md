# 第七章：用户管理与 Excel：手写掌握指南

本章把用户列表、Excel 导入导出和用户详情打印串成一条完整的数据流。页面结构和重复性工具代码已经准备好；需要你亲手完成的是业务数据如何进入页面、如何转换、如何提交，以及如何处理异步状态。

配套勾选清单见 [chapter-07-todolist.md](./chapter-07-todolist.md)。

## 一、哪些已准备好，哪些要亲手完成

### 已准备好：理解即可，不必从头抄写

- `src/api/user-manage.ts`：列表、删除、全量列表、详情和批量导入的 API 包装与主要类型。
- `src/components/UploadExcel/utils.ts`：表头提取和文件扩展名检查等小型通用函数。
- `src/utils/Export2Excel.ts`：把二维数组变成并下载 Excel 文件的通用工具。
- 用户列表、导入页、导出弹窗、上传区域和详情页的基础布局。
- `vue3-print-nb` 插件注册、依赖和 TypeScript 声明。
- 路由参数 `id` 已通过 `props: true` 传给用户详情页。

这些代码有复用价值，但本章的学习重点不是重复手写 Excel 工作簿序列化或 UI 样式。你需要能解释工具的输入、输出和调用时机。

### 需要亲手完成：本章的主要学习目标

| 主题       | 需要你实现的内容                                                       | 主要文件                               |
| ---------- | ---------------------------------------------------------------------- | -------------------------------------- |
| 用户列表   | 请求列表、更新状态、分页、删除确认与刷新                               | `src/views/user-manage/index.vue`      |
| Excel 读取 | 文件选择/拖拽校验、`FileReader` 异步读取、解析首个工作表、发出成功事件 | `src/components/UploadExcel/index.vue` |
| 导入业务   | Excel 列名映射、日期转换、提交导入、成功反馈和返回列表                 | `src/views/import/index.vue`           |
| Excel 导出 | 获取全量用户、映射表头和二维数据、格式化角色/日期、调用通用下载工具    | `src/views/user-manage/index.vue`      |
| 详情和打印 | 根据路由 `id` 请求数据、绑定详情、配置打印区域                         | `src/views/user-info/index.vue`        |

## 二、按数据流学习

### 1. 列表：请求状态、分页和删除

从 `src/views/user-manage/index.vue` 开始。列表、分页组件和事件入口都已经存在，`getUserList`、分页事件和删除事件留有 TODO。

亲手完成时，按以下顺序思考：

1. 用 `getUserManageList({ page, size })` 请求当前页。
2. 将响应中的 `list` 和 `total` 写入对应的 `ref`，模板会自动更新。
3. 页大小变化时更新 `size` 并重新请求；页码变化时更新 `page` 并重新请求。
4. 删除前说明要删除的用户并等待确认；确认后调用 `deleteUser`，成功后刷新列表。
5. 用户取消确认时保持页面状态；请求失败时避免未处理的 Promise rejection。`src/utils/request.ts` 已负责提示后端请求错误，不要对同一错误再弹一次相同提示。
6. 注意 `src/layout/components/AppMain.vue` 使用了 `<keep-alive>`。从导入页返回时，列表组件可能是重新激活而非重新挂载；确保返回列表后重新获取数据，可考虑 `onActivated`。

你要掌握的是“事件修改查询条件，再由请求结果更新视图”的闭环，以及组件缓存对生命周期的影响。

### 2. 导入：先解析文件，再映射业务字段

导入由两个职责不同的步骤组成：上传组件负责把 Excel 变成结构化数据；导入页负责把 Excel 列转换为后端用户字段。

#### 上传组件 `src/components/UploadExcel/index.vue`

页面和类型已经就位。你需要补上文件选择、拖放和读取流程：

1. 点击按钮触发隐藏的 `input[type=file]`。
2. 文件选择与拖放都检查文件数量和后缀；本组件模板接受 `.xlsx`、`.xls` 和 `.csv`。
3. 拖放区设置 `dropEffect`，拒绝多个文件或不支持的格式。
4. 使用 `FileReader` 读取文件内容，再用 `xlsx` 读取工作簿、选取首个工作表。
5. 用已有 `getHeaderRow` 和 `XLSX.utils.sheet_to_json` 得到 `header` 与 `results`，通过 `success` 事件交给父组件。
6. 用 `try/finally` 或等价结构恢复 `loading`；处理空文件、没有工作表、读取失败等情况。
7. 清空 input 的 value，使用户可以再次选择同一个文件。

注意：`header` 用于呈现/识别列名，`results` 是按表头解析出的行对象。不要把整个工作簿对象直接传给业务 API。

#### 导入页 `src/views/import/index.vue`

`handleUploadSuccess` 收到解析结果后，要负责业务转换：

- 建立明确的 Excel 列名到后端字段映射，例如教程中的“姓名”“联系方式”“角色”“开通时间”。
- 只提交后端需要的字段；不要把 Excel 中任意列原样扩散到请求对象。
- 对开通时间处理 Excel 日期序列值。Excel 的数字日期不能直接当作普通时间戳；要考虑空值和已经是日期/字符串的输入。
- 调用已有的 `userBatchImport`，成功后提示导入数量并返回用户列表。
- 通过共享请求拦截器处理后端错误提示，同时确保异步失败不会产生未处理的 rejection。
- 返回列表时记得本章第 1 节提到的缓存刷新问题。

这里的核心能力是把外部文件格式转换成稳定的业务对象，并在提交前控制字段范围和数据格式。

### 3. 导出：业务映射与通用文件工具分开

导出弹窗 `src/views/user-manage/components/Export2Excel.vue` 只收集文件名并发出 `confirm` 事件；Excel 序列化和下载已封装在 `src/utils/Export2Excel.ts`。

在 `src/views/user-manage/index.vue` 的 `handleExportConfirm` 中完成业务部分：

1. 请求全量用户列表，不能只导出当前分页的 `userList`。
2. 定义中文表头与用户字段的对应关系。
3. 按表头顺序把每个用户转换为二维数组的一行。
4. 将角色数组转换为可读内容，将日期格式化为用户可读的日期；处理空角色和空值。
5. 调用 `exportJsonToExcel`，传入 `header`、`data` 和弹窗传来的文件名。
6. 为导出过程设置 loading，并在成功或失败后恢复；将 loading 传给导出弹窗，避免重复点击。

需要掌握“业务字段映射由页面负责，工作簿生成由通用工具负责”的边界。你不需要重写工具里的单元格宽度、工作簿创建和 Blob 下载实现。

### 4. 详情：路由参数、异步数据和打印

路由 `src/router/modules/UserManage.ts` 已配置 `props: true`，详情页收到的 `id` 来自 `/user/info/:id`。

在 `src/views/user-info/index.vue` 中亲手完成：

- 声明并接收 `id`，调用 `getUserDetail(id)`，把结果存入有类型的响应式状态。
- 将模板中的占位内容绑定到详情字段，包括基本资料、备注、头像、经历、专业和荣誉。
- 日期字段使用项目已有的 `$filter.dateFilter`；数组内容使用稳定的 `:key`。
- 给打印按钮绑定 `v-print`，配置只打印 `#userInfoBox`，并按打印生命周期更新按钮 loading。

本节练习的是路由到页面的数据传递、异步状态到模板的绑定，以及指令配置的使用。插件安装和全局注册已经由脚手架完成。

## 三、推荐完成顺序

1. 先完成列表查询与分页，确认你能从分页事件追到 API 参数和列表状态。
2. 完成删除确认与刷新，理解成功、取消、失败三种结果。
3. 完成文件读取组件，再完成导入字段映射和提交；先验证解析结果，再检查最终请求对象。
4. 完成导出数据映射，确认导出的全量数据、日期和角色可读。
5. 完成详情请求和字段绑定，最后接打印指令。
6. 按 [chapter-07-todolist.md](./chapter-07-todolist.md) 做页面验收，并用自己的话解释每个数据流。

## 四、完成后应能讲清楚

- `ref` 中的列表状态怎样由 API 响应更新，分页事件如何影响下一次请求？
- 为什么导出要请求全量列表，而不是直接导出表格当前页？
- Excel 文件读取和导入业务字段映射分别应该由哪个组件负责？
- Excel 日期数字为什么需要转换？导入时怎样避免把无关列提交给后端？
- 导出页面的数据映射和 `Export2Excel` 工具各自负责什么？
- 路由 `props: true` 如何把 URL 中的 `id` 传给详情组件？
- `KeepAlive` 为什么会影响导入后列表刷新？
- 打印配置如何限制打印范围？

## 五、参考代码位置

参考实现位于独立的 `imooc-admin` 项目。对照时重点看以下文件的业务流程，不要复制与当前 Vue/TypeScript 版本不匹配的 API 写法：

- `imooc-admin/src/views/user-manage/index.vue`
- `imooc-admin/src/components/UploadExcel/index.vue`
- `imooc-admin/src/components/UploadExcel/utils.js`
- `imooc-admin/src/views/import/index.vue`
- `imooc-admin/src/views/import/utils.js`
- `imooc-admin/src/views/user-manage/components/Export2Excel.vue`
- `imooc-admin/src/views/user-manage/components/Export2ExcelConstants.js`
- `imooc-admin/src/utils/Export2Excel.js`
- `imooc-admin/src/views/user-info/index.vue`

练习项目中已经准备好的对应位置、类型和接口以当前仓库为准；参考项目只作为行为参考。
