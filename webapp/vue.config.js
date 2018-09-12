/*
 * config of webpack
 *
*/

module.exports = {

  baseUrl: '/',

  pages: {
    client: {
      entry: 'src/client/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    admin: {
      entry: 'src/admin/main.js',
      template: 'public/index.html',
      filename: 'admin.html'
    }
  },

  productionSourceMap: false,

  // configureWebpack: config  => {
  //     console.log( config )
  // },

  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "@/common/scss/variables.scss";`
      }
    }
  },

  // api代理地址
  // This will tell the dev server to proxy any unknown requests (requests that did not match a static file)
  // 笔记本无线ip:192.168.20.74 （数据完好）
  // 笔记本有线ip:192.168.33.83（数据完好）
  // 台式机有线ip:192.168.33.127（有些数据不好）
  devServer: {
    proxy: {
      '/api.production': {
        pathRewrite: {
          '^/api.production': '/'
        },
        target: 'http://192.168.20.29:8084'
      },
      '/api.order': {
        pathRewrite: {
          '^/api.order': '/'
        },
        target: 'http://192.168.20.29:8084'
      },
      '/api.auth': {
        pathRewrite: {
          '^/api.auth': '/'
        },
        target: 'http://192.168.20.29:8084'
      }
    }
  }
}
