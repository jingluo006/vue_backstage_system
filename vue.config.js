const debug = process.env.NODE_ENV !== 'production'
module.exports = {
  lintOnSave: false,
  devServer: {
    // 开发环境下设置为编译好以后直接打开浏览器浏览
    open: true
  },
  configureWebpack: (config) => {
    if (debug) {
      // 开发环境配置
      config.devtool = 'source-map'
    }
  },
  css: {
    // 查看CSS属于哪个css⽂件
    sourceMap: true
  }
}
