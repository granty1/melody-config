module.exports = {
  publicPath: '/melody-config/',
  devServer: {
    host: '0.0.0.0',
    port: 8088,
    https: false,
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Melody Configer'
      return args
    })
  },
}
