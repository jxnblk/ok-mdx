const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const serve = require('webpack-serve')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const config = require('./config')
const WebSocket = require('ws')
const getPort = require('get-port')
const mdx = require('@mdx-js/mdx')
const babel = require('babel-core')
// const ProgressPlugin = require('./progress-plugin')
const ansiHTML = require('ansi-html')
const { AllHtmlEntities } = require('html-entities')

const entities = new AllHtmlEntities()
ansiHTML.setColors({
  reset: [,'transparent'],
  black: '000',
  red: 'f00',
  green: '0f0',
  yellow: 'ff0',
  blue: '00f',
  magenta: 'f0f',
  cyan: '0ff',
  lightgrey: 'eee',
  darkgrey: '444'
})

const devMiddleware = {
  hot: true,
  logLevel: 'error',
  clientLogLevel: 'none',
  stats: 'errors-only'
}

const noop = () => {}
const updateFile = opts => ({ filename, content }, cb = noop) => {
  const filepath = path.join(opts.dirname, filename)
  if (!fs.existsSync(filepath)) return
  try {
    const jsx = mdx.sync(content)
    babel.transform(jsx, {
      presets: [
        'babel-preset-env',
        'babel-preset-stage-0',
        'babel-preset-react',
      ].map(require.resolve)
    })
    fs.writeFile(filepath, content, cb)
  } catch (e) {
    const err = {
      text: e.toString(),
      code: ansiHTML(entities.encode(e.codeFrame))
    }
    cb(err)
  }
}

module.exports = async (opts) => {
  if (opts.basename) delete opts.basename

  config.mode = 'development'
  config.context = opts.dirname
  config.entry = path.join(__dirname, './entry')
  config.output = {
    path: path.join(process.cwd(), 'dev'),
    filename: 'dev.js',
    publicPath: '/'
  }

  config.resolve.modules.push(
    path.join(opts.dirname, 'node_modules'),
    opts.dirname
  )

  if (config.resolve.alias) {
    const whcAlias = config.resolve.alias['webpack-hot-client/client']
    if (!fs.existsSync(whcAlias)) {
      const whcPath = path.dirname(require.resolve('webpack-hot-client/client'))
      config.resolve.alias['webpack-hot-client/client'] = whcPath
    }
  }

  const SOCKET_PORT = await getPort()
  const socketServer = new WebSocket.Server({ port: SOCKET_PORT })
  const update = updateFile(opts)
  const PROGRESS_PORT = await getPort()
  const HOT_PORT = await getPort()
  process.env.WEBPACK_SERVE_OVERLAY_WS_URL = 'ws://localhost:' + HOT_PORT

  socketServer.on('connection', (socket) => {
    socket.on('message', msg => {
      const data = JSON.parse(msg)
      if (data.filename) {
        update(data, (err) => {
          if (err) {
            const json = JSON.stringify({
              error: err
            })
            socket.send(json)
            return
          }
          socket.send(JSON.stringify({ message: 'saved' }))
        })
      }
    })
    socket.send(JSON.stringify({ message: 'beep' }))
  })

  config.plugins.push(
    // new ProgressPlugin({ port: PROGRESS_PORT }),
    new webpack.DefinePlugin({
      DEV: JSON.stringify(true),
      OPTIONS: JSON.stringify(opts),
      DIRNAME: JSON.stringify(opts.dirname),
      SOCKET_PORT: JSON.stringify(SOCKET_PORT),
      PROGRESS_PORT: JSON.stringify(PROGRESS_PORT),
      'process.env': { WEBPACK_SERVE_OVERLAY_WS_URL: JSON.stringify('ws://localhost:' + HOT_PORT) }
    })
  )

  const serveOpts = {
    config,
    devMiddleware,
    logLevel: 'error',
    content: opts.dirname,
    port: opts.port,
    hotClient: {
      reload: false,
      logLevel: 'error',
      port: HOT_PORT
    },
    add: (app, middleware, options) => {
      app.use(convert(history({})))
    }
  }

  if (opts.verbose) {
    serveOpts.logLevel = 'debug'
    serveOpts.devMiddleware.logLevel = 'debug'
    serveOpts.devMiddleware.stats = 'verbose'
    serveOpts.hotClient.logLevel = 'debug'
    serveOpts.config.stats = 'verbose'
  }

  return new Promise((resolve, reject) => {
    serve({}, serveOpts)
      .then(server => {
        server.on('build-finished', () => {
          resolve({ server })
        })
      })
      .catch(reject)
  })
}
