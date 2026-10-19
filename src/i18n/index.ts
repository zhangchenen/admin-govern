import { createI18n } from 'vue-i18n'
import { LANG } from '@/constant'
import { getItem } from '@/utils/storage'
import mZhLocale from './lang/zh'
import mEnLocale from './lang/en'
const messages = {
  en: {
    msg: {
      ...mEnLocale,
    },
    route: {
      profile: 'Profile',
      chart: 'Charts',
      user: 'User Management',
      userManage: 'Users',
      userInfo: 'User Details',
      excelImport: 'Import Users',
      roleList: 'Roles',
      permissionList: 'Permissions',
      article: 'Articles',
      articleRanking: 'Article Ranking',
      articleCreate: 'Create Article',
      articleEditor: 'Edit Article',
      articleDetail: 'Article Details',
    },
  },
  zh: {
    msg: {
      ...mZhLocale,
    },
    route: {
      profile: '个人中心',
      chart: '数据图表',
      user: '用户管理',
      userManage: '用户列表',
      userInfo: '用户详情',
      excelImport: '导入用户',
      roleList: '角色列表',
      permissionList: '权限列表',
      article: '文章管理',
      articleRanking: '文章排名',
      articleCreate: '创建文章',
      articleEditor: '编辑文章',
      articleDetail: '文章详情',
    },
  },
}
const locale = getItem(LANG) === 'en' ? 'en' : 'zh'
function getLanguage(){
  return locale
}
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale:getLanguage(),
  messages,
})
export default i18n
