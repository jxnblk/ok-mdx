const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const serve = require('webpack-serve')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const config = require('./config')
const WebSocket = require('ws')
const getPort = require('get-port')

const dev = {
  hot: true,
  logLevel: 'error',
  clientLogLevel: 'none',
  stats: 'errors-only'
}

const updateFile = opts => ({ filename, content }, cb) => {
  console.log('update', opts.dirname, filename, content)
  const filepath = path.join(opts.dirname, filename)
  if (!fs.existsSync(filepath)) return
  fs.writeFile(filepath, content, cb)
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

  const SOCKET_PORT = await getPort()
  const socketServer = new WebSocket.Server({ port: SOCKET_PORT })
  const update = updateFile(opts)

  socketServer.on('connection', (socket) => {
    socket.on('message', msg => {
      console.log(msg)
      const data = JSON.parse(msg)
      console.log('message', data)
      if (data.filename) {
        update(data)
      }
    })
    socket.send('beep')
  })

  config.plugins.push(
    new webpack.DefinePlugin({
      DEV: JSON.stringify(true),
      OPTIONS: JSON.stringify(opts),
      DIRNAME: JSON.stringify(opts.dirname),
      SOCKET_PORT: JSON.stringify(SOCKET_PORT)
    })
  )

  const serveOpts = {
    config,
    dev,
    logLevel: 'error',
    content: opts.dirname,
    port: opts.port,
    // open: opts.open
    hotClient: { logLevel: 'error' },
    add: (app, middleware, options) => {
      app.use(convert(history({})))
    }
  }

  /*
  if (opts.verbose) {
    serveOpts.logLevel = 'debug'
    serveOpts.dev.logLevel = 'debug'
    serveOpts.hot.logLevel = 'debug'
    serveOpts.dev.stats = 'verbose'
    serveOpts.config.stats = 'verbose'
  }
  */

  return new Promise((resolve, reject) => {
    serve({}, serveOpts)
      .then(server => {
        // console.log('SERVER', server)
        server.on('build-started', () => {
          console.log('BUILD-STARTED')
        })
        server.on('build-finished', () => {
          console.log('BUILD-FINISHED')
        })
        server.on('compiler-warning', () => {
          console.log('COMPILER-WARNING')
        })
        server.on('listening', ({ server, options }) => {
          console.log('listening')
          resolve({ server, options })
        })
        // server.compiler.hooks.done.tap({ name: 'ok-mdx' }, (stats) => {
        // resolve({ server, stats })
        // })
      })
      .catch(reject)
  })
}
