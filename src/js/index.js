import '../scss/index.scss'
import { 
  Header,
  Nav,
  NavItem
} from '../components'
import { news_type } from '../utils/data'
import { thumbLoad } from '../utils/tools'
import { IndexModel } from '../model/index'

// 组件实例
const header = new Header(),
      nav = new Nav(),
      navItem = new NavItem()

// 数据请求实例
const indexModel = new IndexModel()

const App = ($) => {
  const app = $('#app')
  const list = $('#list')
  // 当前的新闻类型变量
  let field = '头条'

  const init = () => {
    // 渲染完成后才能进行事件绑定，因此需要渲染函数完成后回调事件处理函数
    render().then(() => {
      bindListener()
    })
    indexModel.getNewList(field).then(data => {
      const tpl = navItem.tpl(data[0], 0)
      list.html(tpl)
      thumbLoad($('.news_img'))
    })
  }

  const render = () => {
    // 利用promise实现回调
    return new Promise((resolve, reject) => {
      _renderHeader()
      _renderNav()
      resolve()
    })
  }

  const bindListener = () => {
    // jquery的on事件绑定函数第二个可选参数是事件委托选择器
    $('.nav .nav-wrapper').on('click', '.item', itemSelected)
  }

  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    app.append(header.tpl({
      title: '青秋的新闻头条',
      showLeftIcon: false,
      showRightIcon: true
    }))
  }

  const _renderNav = () => {
    // 将item组件插入到nav组件中
    const tpl = nav.tpl(news_type)
    app.append(tpl.navStr)
    $('.nav .nav-wrapper').append(tpl.itemStr)
  }

  // item组件的事件处理函数
  function itemSelected () {
    const $this = $(this)
    // siblings() 获得匹配集合中每个元素的同胞，通过选择器进行筛选是可选的。
    $this.addClass('current').siblings('.item').removeClass('current')
    field = $this.attr('data-type')
    indexModel.getNewList(field).then(data => {
      const tpl = navItem.tpl(data[0], 0)
      list.html(tpl)
      thumbLoad($('.news_img'))
    })
  }

  init()
}

App(Zepto)