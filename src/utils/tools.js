function tplReplace () {
  return /{{(.*?)}}/g
}

function thumbLoad (dom) {
  dom.on('load', function () {
    $(this).css('opacity', '1')
  })
}

module.exports = {
  tplReplace,
  thumbLoad
}