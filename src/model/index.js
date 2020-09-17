import { HTTP } from '../utils/http'

class IndexModel extends HTTP {
  // 参数为新闻的类型和分页每页的新闻条数
  getNewList (field, pageQuantity = 10) {
    // 数据是异步请求到的，因此需要返回一个promise对象
    return new Promise((resolve, reject) => {
      this.post(
        // 此url实际上是后台的控制器路径，非真实的api接口
        'Juhe/getNewsList',
        {
          field,
          key: '0ba9ba11c7a5db665a82c6932e65143c'
        },
        'JSON',
        function(data) {
          // 将请求得到的数据按照分页的要求转化成分页数组
          const newList = data.result.data
          const length = newList.length
          let index = 0
          let pageList = []
          while (index < length) {
            pageList.push(newList.slice(index, index += pageQuantity))
          }
          resolve(pageList)
        },
        function(errMsg) {
          reject(errMsg)
        }
      )
    })  
  }
}

export {
  IndexModel
}