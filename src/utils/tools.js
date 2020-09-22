function tplReplace () {
  return /{{(.*?)}}/g
}

function thumbLoad (dom) {
  dom.on('load', function () {
    $(this).css('opacity', '1')
  })
}

function scrollToBottom (callback) {
  if (_getScrollTop() + _getClientHeight() >= _getScrollHeight()) {
    callback()
  }
}

function getUrlQueryValue (key) {
  // ?url=https://mini.eastday.com/mobile/200921195941377.html&uniqueKey=560828910f11778da36942006be29343
  // ()：子表达式，^：以什么开头，|：或者，&：就是指&符号
  // 以空或者&开头 + key值 + = + 以&开头（出现0次或多次） + 以&或者空结尾
  // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
        res = window.location.search.substr(1).match(reg)[2]
  return res
}

module.exports = {
  tplReplace,
  thumbLoad,
  scrollToBottom,
  getUrlQueryValue
}

// *************************内部方法************************
// 网页被卷曲的高度
function _getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop
}

// 网页可见区域高度
function _getClientHeight() {
  return document.documentElement.clientHeight || document.body.clientHeight
}

// 网页正文全文高度
function _getScrollHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight
}