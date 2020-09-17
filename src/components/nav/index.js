import navTpl from './nav.tpl'
import itemTpl from './item.tpl'
import './index.scss'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'Nav',
    tpl (navData) {
      // 获取navWrapper标签的宽度
      const length = navData.length
      const wrapperWidth = 6 * length + 'rem'

      let itemStr = ''
      let navStr = ''
      // 获取nav的str
      navStr = navTpl().replace(tplReplace(), wrapperWidth)
      // 获取所有item的str
      navData.forEach((item, index) => {
        itemStr += itemTpl().replace(tplReplace(), (node, key) => {
          return {
            isCurrent: index === 0 ? 'current' : '',
            type: item.type,
            typeName: item.chs
          }[key]
        })
      })

      return {
        navStr,
        itemStr
      }
    }
  }
}