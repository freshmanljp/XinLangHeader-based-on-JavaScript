const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const miniCSSExtractPlugin = require('mini-css-extract-plugin')

const config = {
  mode: 'development',
  // 入口文件，单文件直接写路径，多文件写成对象
  entry: {
    index: path.resolve(__dirname, './src/js/index.js'),
    detail: path.resolve(__dirname, './src/js/detail.js'),
    collection: path.resolve(__dirname, './src/js/collection.js')
  },
  // 输出文件
  output: {
    // 这里是绝对路径的拼接
    path: path.resolve(__dirname + '/dist'),
    // 中括号代表变量
    filename: 'js/[name].js'
  },
  module: {
    // 打包的时候，针对不同的文件进行怎样的处理，用什么样的依赖进行处理
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          'presets': ['@babel/preset-env']
        }
      }, {
        test: /\.tpl$/,
        loader: 'ejs-loader'
        // options: {
        //   esModule: false
        // }
      }, {
        test: /\.scss$/,
        // 多个loader处理用use，优先级是从后往前
        // loader需要配置的情况用对象
        use: [
        // {
        //   loader: miniCSSExtractPlugin.loader,
        //   options: {
        //     hmr: process.env.NODE_ENV === 'development'
        //   }
        // },
        // 内嵌样式，不单独拉出css文件
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              // 兼容浏览器最近5个版本
              return [autoprefixer('last 5 versions')]
            }
          }
        },
        'sass-loader'
        ]
      }, {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        use: [
          'url-loader?limit=1024&name=img/[name]-[hash:16].[ext]',
          // 压缩图片用的
          'image-webpack-loader'
          // 'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new uglify(),

    // 每个页面文件配置一个htmlWebpackPlugin
    new htmlWebpackPlugin({
      // 压缩
      minify: {
        // 删除所有注释
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      // 结合ejs模板语法设置html的title
      title: '青秋新闻头条',
      // chunks排序方式设置为手动排
      chunksSortMode: 'manual',
      chunks: ['index'],
      // 排除块文件
      excludeChunks: ['node-modules'],
      // 配置hash，防缓存用
      hash: true
    }),
    new htmlWebpackPlugin({
      // 压缩
      minify: {
        // 删除所有注释
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'detail.html',
      template: path.resolve(__dirname, 'src/detail.html'),
      // 结合ejs模板语法设置html的title
      title: '详情页面',
      // chunks排序方式设置为手动排
      chunksSortMode: 'manual',
      chunks: ['detail'],
      // 排除块文件
      excludeChunks: ['node-modules'],
      // 配置hash，防缓存用
      hash: true
    }),
    new htmlWebpackPlugin({
      // 压缩
      minify: {
        // 删除所有注释
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'collection.html',
      template: path.resolve(__dirname, 'src/collection.html'),
      // 结合ejs模板语法设置html的title
      title: '我的收藏',
      // chunks排序方式设置为手动排
      chunksSortMode: 'manual',
      chunks: ['collection'],
      // 排除块文件
      excludeChunks: ['node-modules'],
      // 配置hash，防缓存用
      hash: true
    }),

    new miniCSSExtractPlugin({
      filename: 'css/[name].css'
    })
  ],

  devServer: {
    watchOptions: {
      ignored: /node_modules/
    },
    host: 'localhost',
    port: 3200
  },
  devtool: 'inline-source-map'
}

module.exports = config