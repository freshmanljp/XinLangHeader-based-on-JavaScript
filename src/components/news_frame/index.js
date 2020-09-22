import tpl from './index.tpl'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'NewsFrame',
    tpl(url) {
      return tpl().replace(tplReplace(), url)
    }
  }
}