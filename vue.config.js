'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // page title
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const Timestamp = new Date().getTime()
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `\$VUE_APP_PARAM: ${defaultSettings.title};`
      }
    },
    extract: {
      filename: `static/css/[name].${Timestamp}.css`,
      chunkFilename: `static/css/[name].${Timestamp}.css`
    }
  },
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false, // 设置为false浏览器不能看到源码
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/v1': {
        target: process.env.VUE_APP_PROXY_TARGET,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      }
    }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.output.filename(`static/js/[name].${Timestamp}.js`).end()
    config.output.chunkFilename(`static/js/[name].${Timestamp}.js`).end()
    config.plugins.delete('prefetch')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module.rule('images')
      .use('url-loader')
      .tap(options => {
        options.fallback.options.name = `static/img/[name].[hash:8].${Timestamp}.[ext]`
        return options
      })
    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          inline: /runtime\..*\.js$/
        }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
