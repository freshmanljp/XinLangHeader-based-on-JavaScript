import tpl_0 from '../nav_item/tpl_0.tpl'
import tpl_1 from '../nav_item/tpl_1.tpl'
import tpl_2 from '../nav_item/tpl_2.tpl'
import tpl_3 from '../nav_item/tpl_3.tpl'
import './index.scss'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'NavItem',
    tpl (data, pageNum) {
      let list = ''

      data.forEach((item, index) => {
        let template = null
        if (!item.thumbnail_pic_s) {
          template = tpl_0
        } else if (!item.thumbnail_pic_s02) {
          template = tpl_1
        } else if (!item.thumbnail_pic_s03) {
          template = tpl_2
        } else {
          template = tpl_3
        }
        list += template().replace(tplReplace(), (node, key) => {
          return {
            // pageNum和index是方便在缓存池中找到对应的那条数据
            pageNum,
            index,
            // 详情页取数据的时候需要使用，因为详情页无法取得缓存池的数据
            uniqueKey: item.uniquekey,
            // 文章详情的页面html的url
            url: item.url,
            title: item.title,
            author: item.author_name,
            date: item.date,
            thumbnail_pic_s: item.thumbnail_pic_s,
            thumbnail_pic_s02: item.thumbnail_pic_s02,
            thumbnail_pic_s03: item.thumbnail_pic_s03
          }[key]
        })
      })

      return list
    }
  }
}