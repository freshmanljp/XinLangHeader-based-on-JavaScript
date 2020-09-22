import '../scss/collection.scss'
import { 
  Header,
  NoCollectionTip,
  NavItem
} from '../components'
import { thumbLoad } from '../utils/tools'

// 复用index页面的listItem组件
const header = new Header(),
      noCollectionTip = new NoCollectionTip(),
      navItem = new NavItem()

const App = ($) => {
  const $app = $('#app'),
        $list = $('.list'),
        collection = JSON.parse(window.localStorage.getItem('collection')) || {}

  const init = () => {
    render().then(bindEvent)
  }

  const render = () => {
    return new Promise((resolve, reject) => {
      _renderHeader()
      if (Object.keys(collection).length === 0) {
        _renderNoCollectionTip()
      } else {
        const data = _arrangeItemData(collection)
        _renderList(data)
      }
      resolve()
    })
  }

  const bindEvent = () => {
    $list.on('click', '.news-item', itemClickHandle)
  }

  // 将key为uniqueKey的collection对象转换成list组件能接受的数组数据
  const _arrangeItemData = (data) => {
    const newData = []
    Object.keys(data).forEach(item => {
      // 注意：collection的parse后其每个子对象的数据仍需要parse，即parse只parse一层
      newData.push(JSON.parse(data[item]))
    })
    return newData
  }

  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    $app.append(header.tpl({
      title: '我的收藏',
      showLeftIcon: true,
      showRightIcon: false
    }))
  }

  const _renderNoCollectionTip = () => {
    $app.append(noCollectionTip.tpl('没有新闻收藏'))
  }

  const _renderList = (data) => {
    $list.html(navItem.tpl(data))
    thumbLoad($('.news_img'))
  }

  function itemClickHandle () {
    const $this = $(this)
    const url = $this.attr('data-url')
    const uniqueKey = $this.attr('data-uniqueKey')
    const target = collection[uniqueKey]
    window.localStorage.setItem('target', JSON.stringify(target))
    window.location.href = `detail.html?url=${url}&uniqueKey=${uniqueKey}`
  }

  init()
}

App(Zepto)