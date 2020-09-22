import tpl from './index.tpl'
import './index.scss'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'Collector',
    tpl (isCollected) {
      return tpl().replace(tplReplace(), isCollected ? 'full' : 'null')
    },
    changeCollector (isCollected) {
      $('.collector').addClass(isCollected ? 'full' : 'null')
                     .removeClass(!isCollected ? 'full' : 'null')
    }
  }
}