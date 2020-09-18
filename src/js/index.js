import '../scss/index.scss'
import { 
  Header,
  Nav,
  NavItem,
  Loading
} from '../components'
import { news_type } from '../utils/data'
import { thumbLoad } from '../utils/tools'
import { IndexModel } from '../model/index'

// 组件实例
const header = new Header(),
      nav = new Nav(),
      navItem = new NavItem(),
      loading = new Loading()

// 数据请求实例
const indexModel = new IndexModel()

const App = ($) => {
  const app = $('#app')
  const list = $('#list')
  // 当前的新闻类型变量，设置的页码数，每类信息包含的页面数，前端缓存池
  let field = 'top',
      pageNum = 0,
      pageCount = 0,
      dataCache = {}

  const init = () => {
    // 渲染完成后才能进行事件绑定，因此需要渲染函数完成后回调事件处理函数
    render().then(() => {
      bindListener()
    })
    
  }

  // 页面的总渲染函数
  const render = () => {
    // 利用promise实现回调
    return new Promise((resolve, reject) => {
      _renderHeader()
      _renderNav()
      resolve()
      _renderList(field, pageNum)
    })
  }

  // 页面的总事件绑定函数
  const bindListener = () => {
    // jquery的on事件绑定函数第二个可选参数是事件委托选择器
    $('.nav .nav-wrapper').on('click', '.item', itemSelected)
  }

  // 头部组件的渲染函数
  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    app.append(header.tpl({
      title: '青秋的新闻头条',
      showLeftIcon: false,
      showRightIcon: true
    }))
  }

  // 导航组件的渲染函数
  const _renderNav = () => {
    // 将item组件插入到nav组件中
    const tpl = nav.tpl(news_type)
    app.append(tpl.navStr)
    $('.nav .nav-wrapper').append(tpl.itemStr)
  }

  // 列表组件的渲染函数
  const _renderList = (field, pageNum) => {
    // 如果存在该分类缓存，直接插入缓存池中的数据
    if (dataCache[field]) {
      _insertItem(dataCache[field][pageNum], pageNum)
    } else {  // 不存在该分类缓存则请求数据，并将数据缓存到缓存池中
      // ajax请求时页面显示loading，因此需要把list内的item清空
      list.html('')
      // 将loading组件加载到list中
      list.append(loading.tpl())
      indexModel.getNewList(field).then(data => {
        // 存分类的包换的总页数
        pageCount = data.length
        // 将数据缓存到缓存池中
        dataCache[field] = data
        _insertItem(dataCache[field][pageNum], pageNum)
      })
    }
  }

  // 列表组件的item插入处理函数
  const _insertItem = (data,pageNum) => {
    // 获取列表填充数据后的模板字符串
    const tpl = navItem.tpl(data, pageNum)
    list.html(tpl)
    thumbLoad($('.news_img'))
  }

  // item组件的事件处理函数
  function itemSelected () {
    const $this = $(this)
    // siblings() 获得匹配集合中每个元素的同胞，通过选择器进行筛选是可选的。
    $this.addClass('current').siblings('.item').removeClass('current')
    // 切换field为点击的分类类型
    field = $this.attr('data-type')
    // 重新渲染列表
    _renderList(field, pageNum)
  }

  init()
}

App(Zepto)