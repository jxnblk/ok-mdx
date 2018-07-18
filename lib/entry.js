import path from 'path'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

require('webpack-serve-overlay')

let req
const getRoutes = () => {
  req = require.context(DIRNAME, true, /\.(md|mdx|jsx)$/)
  const codeContext = require.context('!!raw-loader!' + DIRNAME, true, /\.(md|mdx|jsx)$/)
  const routes = req.keys()
    .filter(key => !/node_modules/.test(key))
    .map(key => {
      const extname = path.extname(key)
      const name = path.basename(key, extname)
      const exact = name === 'index'
      const dirname = path.dirname(key).replace(/^\./, '')
      const pathname = dirname + '/' + (exact ? '' : name)
      const mod = req(key)
      const Component = mod.default
      const code = codeContext(key)
      if (typeof Component !== 'function') return null
      return {
        key,
        name,
        extname,
        dirname,
        exact,
        path: pathname,
        Component,
        code
      }
    })
    .filter(Boolean)
  return routes
}

const routes = getRoutes()
const app = render(<App routes={routes} />, root)

// app.setState({ routes })

if (module.hot) {
  // module.hot.decline()
  module.hot.accept()
    /*
  module.hot.accept(req.id, () => {
    const routes = getRoutes()
    app.setState({ routes })
  })
  */
}
