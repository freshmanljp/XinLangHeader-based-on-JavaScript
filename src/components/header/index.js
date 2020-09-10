import tpl from './index.tpl';
import './index.scss';

import { tplReplace } from '../../utils/tools';

export default () => {
	return {
		name: 'Header',
		tpl (options) {
			// replace() 方法的第二个参数可以是函数而不是字符串，每个匹配都调用该函数，它返回的字符串将作为替换文本使用。
			// 该函数的第一个参数是匹配模式的字符串。接下来的参数是与模式中的子表达式匹配的字符串，可以有 0 个或多个这样的参数。
			return tpl().replace(tplReplace(), (node, key) => {
      	return {
          title: options.title,
          showLeftIcon: !options.showLeftIcon && 'none',
          showRightIcon: !options.showRightIcon && 'none'
      	}[key]
      })
		}
	}
}