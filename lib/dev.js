const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const serve = require('webpack-serve')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const config = require('./config')

const dev = {
  hot: true,
  logLevel: 'error',
  clientLogLevel: 'none',
  stats: 'errors-only'
}

module.exports = async (opts) => {
  if (opts.basename) delete opts.basename

  config.mode = 'development'
  config.context = opts.dirname
  config.entry = path.join(__dirname, './App')
  config.output = {
    path: path.join(process.cwd(), 'dev'),
    filename: 'dev.js',
    publicPath: '/'
  }

  config.resolve.modules.push(
    path.join(opts.dirname, 'node_modules'),
    opts.dirname
  )

  config.plugins.push(
    new webpack.DefinePlugin({
      DEV: JSON.stringify(true),
      OPTIONS: JSON.stringify(opts),
      DIRNAME: JSON.stringify(opts.dirname)
    })
  )

  const serveOpts = {
    config,
    dev,
    logLevel: 'error',
    content: opts.dirname,
    port: opts.port,
    hot: { logLevel: 'error' },
    add: (app, middleware, options) => {
      app.use(convert(history({})))
    }
  }

  if (opts.verbose) {
    serveOpts.logLevel = 'debug'
    serveOpts.dev.logLevel = 'debug'
    serveOpts.hot.logLevel = 'debug'
    serveOpts.dev.stats = 'verbose'
    serveOpts.config.stats = 'verbose'
  }

  return new Promise((resolve, reject) => {
    serve({}, serveOpts)
      .then(server => {
        server.on('listening', ({ server, options }) => {
          resolve({ server, options })
        })
        // server.compiler.hooks.done.tap({ name: 'ok-mdx' }, (stats) => {
        // resolve({ server, stats })
        // })
      })
      .catch(reject)
  })
}
