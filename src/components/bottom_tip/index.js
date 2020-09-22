import tpl from './index.tpl'
import './index.scss'
import { tplReplace } from '../../utils/tools'

export default () => {
  return {
    name: 'Bottom_tip',
    tpl (isLoading, text) {
      return tpl().replace(tplReplace(), (node, key) => {
        return {
          isLoading,
          text
        }[key]
      })
    }
  }
}