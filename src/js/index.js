import '../scss/index.scss'
import { 
  Header,
  Nav,
  NavItem,
  Loading,
  BottomTip
} from '../components'
import { news_type } from '../utils/data'
import { 
  thumbLoad,
  scrollToBottom
} from '../utils/tools'
import { IndexModel } from '../model/index'

// 组件实例
const header = new Header(),
      nav = new Nav(),
      navItem = new NavItem(),
      loading = new Loading(),
      bottomTip = new BottomTip()

// 数据请求实例
const indexModel = new IndexModel()

const App = ($) => {
  const $app = $('#app')
  const $list = $('#list')
  // 当前的新闻类型变量，设置的页码数，设置每类信息每页的新闻条数，每类信息包含的页面数，前端缓存池，滑动到底部处理事件锁
  let field = 'top',
      pageNum = 0,
      showCount = 10,
      pageCount = 0,
      dataCache = {},
      bottomLock = false

  // 滑动至底部的事件处理函数绑定，用bind进行callback绑定，并用一个外部变量存储方便解绑
  const newScrollToBottom = scrollToBottom.bind(null, scrollToBottomHandle)

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
      _renderList(field, pageNum, showCount)
    })
  }

  // 页面的总事件绑定函数
  const bindListener = () => {
    // jquery的on事件绑定函数第二个可选参数是事件委托选择器
    $('.nav .nav-wrapper').on('click', '.item', itemSelected)
    // 给list添加click事件处理函数，由news-item事件委托
    $list.on('click', '.news-item', itemClickHandle)
  }

  // 头部组件的渲染函数
  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    $app.append(header.tpl({
      title: '青秋的新闻头条',
      showLeftIcon: false,
      showRightIcon: true
    }))
  }

  // 导航组件的渲染函数
  const _renderNav = () => {
    // 将item组件插入到nav组件中
    const tpl = nav.tpl(news_type)
    $app.append(tpl.navStr)
    $('.nav .nav-wrapper').append(tpl.itemStr)
  }

  // 列表组件的渲染函数
  const _renderList = (field, pageNum, showCount) => {
    // 如果存在该分类缓存，直接插入缓存池中的数据
    if (dataCache[field]) {
      _insertItem('cover', dataCache[field][pageNum], pageNum)
    } else {  // 不存在该分类缓存则请求数据，并将数据缓存到缓存池中
      // 显示loading组件
      _appendLoading()
      indexModel.getNewList(field, showCount).then(data => {
        // 存分类的包换的总页数
        pageCount = data.length
        // 将数据缓存到缓存池中
        dataCache[field] = data
        _insertItem('cover', dataCache[field][pageNum], pageNum)
      })
    }
  }

  // 显示loading组件函数
  const _appendLoading = () => {
    // ajax请求时页面显示loading，因此需要把list内的item清空
    $list.html('')
    // 将loading组件加载到list中
    $list.append(loading.tpl())
  }

  // 页面回到头部函数
  const _scrollToTop = (delay) => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, delay)
  }
  // 页面滚动事件监听处理函数的绑定函数
  const _handleScrollBind = (isBind) => {
    isBind ? $(window).on('scroll', newScrollToBottom) : $(window).off('scroll', newScrollToBottom)
  }

  // 列表组件的item插入处理函数，how表示新闻item的插入方式为append还是cover
  const _insertItem = (how, data, pageNum) => {
    // 获取列表填充数据后的模板字符串
    const tpl = navItem.tpl(data, pageNum)
    switch (how) {
      case 'cover': 
        $list.html(tpl)
        // item渲染后续处理
        _afterItemRender(true)
        break
      case 'append':
        $list.append(tpl)
        // item渲染后续处理
        _afterItemRender(false)
        break
    }
  }

  // item组件渲染后的处理函数，isBindEvent设置是否绑定scroll处理函数
  const _afterItemRender = (isBindEvent) => {
    // 根据isBindEvent绑定scroll的事件处理函数
    isBindEvent && _handleScrollBind(true)
    // 给图片都绑定上加载函数
    thumbLoad($('.news_img'))
    // 渲染完后解锁事件变量
    bottomLock = false
    // 渲染完后把上一个tip删掉
    _renderBottomTip('remove')
  }

  // 底部提示栏的渲染函数
  const _renderBottomTip = (how, isLoading, text) => {
    switch (how) {
      // 用于初次加载显示提示的时候
      case 'append':
        $app.append(bottomTip.tpl(isLoading, text))
        break
      // 用于加载完消除提示时
      case 'remove':
        $('.bottom_tip').remove()
        break
      // 用于加载完全时
      case 'removeAndAppend':
        $('.bottom_tip').remove()
        $app.append(bottomTip.tpl(isLoading, text))
    }
  } 

  // item组件的事件处理函数
  function itemSelected () {
    const $this = $(this)
    // siblings() 获得匹配集合中每个元素的同胞，通过选择器进行筛选是可选的。
    $this.addClass('current').siblings('.item').removeClass('current')
    // 切换field为点击的分类类型
    field = $this.attr('data-type')
    // 切换的时候解绑scroll的事件处理函数，放置重复触发到底部事件处理函数
    _handleScrollBind(false)
    // 切换的时候还要将tip提示栏清除
    _renderBottomTip('remove')
    // 切换时将该分类的页数清0
    pageNum = 0
    // 重新渲染列表
    _renderList(field, pageNum)
    // 将页面滚动到头部位置
    _scrollToTop(150)
  }

  // 页面划到底部的事件处理函数
  function scrollToBottomHandle () {
    // 页码Num从0开始到pageCount-1
    if (pageNum < pageCount - 1) {
      // 仍有页面可加载的情况
      // 用事件锁放置到底事件处理函数任务多次执行
      if (!bottomLock) {
        bottomLock = true
        _renderBottomTip('append', 'loading', '客官请稍等，新鲜内容即将呈现')
        // 500ms后插入下一页的内容
        setTimeout(() => {
          pageNum++
          _insertItem('append', dataCache[field][pageNum], pageNum)
        }, 1000)
      }
    } else {
      _renderBottomTip('removeAndAppend', '', '客官内容已经全部加载完啦，没有更多了哦')
    }
  }

  // 新闻item的点击事件处理函数
  function itemClickHandle () {
    const $this = $(this)
    const page = $this.attr('data-page'),
          index = $this.attr('data-index'),
          url = $this.attr('data-url'),
          uniqueKey = $this.attr('data-uniqueKey')
    // 存储相应item的数据
    window.localStorage.setItem('target', JSON.stringify(dataCache[field][page][index]))
    // 详情页面跳转并传递url和key参数
    window.location.href = `detail.html?url=${url}&uniqueKey=${uniqueKey}`
  }

  init()
}

App(Zepto)