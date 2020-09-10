import '../scss/index.scss'
import { Header } from '../components'

const header = new Header

const App = ($) => {
  const app = $('#app')

  const init = () => {
    render()
  }

  const render = () => {
    _renderHeader()
  }

  const _renderHeader = () => {
    // append() 方法在被选元素的结尾（仍然在内部）插入指定内容。
    app.append(header.tpl({
      title: '青秋的新闻头条',
      showLeftIcon: false,
      showRightIcon: true
    }))
  }

  init()
}

App(Zepto)