const webpack = require('webpack')
const WebSocket = require('ws')

  /*
class ProgressPlugin {
  constructor (opts) {
  }

  apply (compiler) {
    new webpack.ProgressPlugin((percent, msg) => {
      console.log('PROGRESS', percent)
    }).apply('compiler')
  }
}
*/

const PORT = '98765'

function ProgressPlugin (opts = {}) {
  const port = opts.port || PORT
  const server = new WebSocket.Server({ port })
  let socket
  server.on('connection', s => {
    socket = s
  })
  return new webpack.ProgressPlugin((percent, status) => {
    if (!socket || !socket.send) return
    const json = JSON.stringify({ percent, status })
    socket.send(json)
  })
}

module.exports = ProgressPlugin
