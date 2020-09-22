import '../scss/detail.scss'
import { 
  Header,
  NewsFrame,
  Collector
} from '../components'
import { getUrlQueryValue } from '../utils/tools'

const header = new Header(),
      newsFrame = new NewsFrame(),
      collector = new Collector()

const App = ($) => {
  const $app = $('#app'),
        $frameWrapper = $('#frame_wrapper'),
        target = window.localStorage.getItem('target'),
        uniqueKey = getUrlQueryValue('uniqueKey') || target.uniqueKey,
        url = getUrlQueryValue('url') || target.url

  // 取出localStorage中的收藏item，若没有相应的item就用空对象代替，否则会报错
  let collection = JSON.parse(window.localStorage.getItem('collection')) || {},
      isCollected = false

  const init = () => {
    render().then(bindEvent)
  }

  // 页面总渲染函数
  const render = () => {
    return new Promise((resolve, reject) => {
      _renderHeader()
      _renderFrame()
      _renderCollector()
      resolve()
    })
  }

  // 页面总事件绑定函数
  const bindEvent = () => {
    $('#collector').on('click', collectionClick)
  }

  // 头部组件渲染函数
  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    $app.append(header.tpl({
      title: '新闻详情',
      showLeftIcon: true,
      showRightIcon: false
    }))
  }

  // 详情页frame渲染函数
  const _renderFrame = () => {
    // 填充详情页内容为frame
    $frameWrapper.html(newsFrame.tpl(url))
  }

  // 收藏按钮组件渲染函数
  const _renderCollector = () => {
    // 查询收藏item中有无该uniqueKey
    isCollected = Boolean(collection[uniqueKey])
    // 根据有无渲染收藏按钮组件
    const collectorStr = collector.tpl(isCollected)
    $app.append(collectorStr)
  }

  // 收藏按钮点击处理函数
  function collectionClick () {
    if (!isCollected) {
      collection[uniqueKey] = target
      isCollected = true
    } else {
      delete collection[uniqueKey]
      isCollected = false
    }
    collector.changeCollector(isCollected)
    window.localStorage.setItem('collection', JSON.stringify(collection))
  }

  init()
}

App(Zepto)