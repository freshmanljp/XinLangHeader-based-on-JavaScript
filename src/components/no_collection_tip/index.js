import tpl from './index.tpl'
import './index.scss'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'NoCollectionTip',
    tpl (text) {
      return tpl().replace(tplReplace(), text)
    }
  }
}