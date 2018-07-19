import path from 'path'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

require('webpack-serve-overlay')

const req = require.context(DIRNAME, true, /\.(md|mdx|jsx)$/)
const codeContext = require.context('!!raw-loader!' + DIRNAME, true, /\.(md|mdx|jsx)$/)
const routes = req.keys()
  .filter(key => !/node_modules/.test(key))
  .map(key => {
    const extname = path.extname(key)
    const name = path.basename(key, extname)
    const exact = name === 'index'
    const dirname = path.dirname(key).replace(/^\./, '')
    const pathname = dirname + '/' + (exact ? '' : name)
    let mod, Component
    try {
      mod = req(key)
      Component = mod.default
    } catch (err) {
      console.error(err)
    }
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

const providerContext = require.context(DIRNAME, false, /\_app\.js$/)
const Provider = providerContext.keys().length
  ? providerContext('./_app.js').default
  : null

const app = render(
  <App
    routes={routes}
    Provider={Provider}
  />,
  root
)

if (module.hot) {
  module.hot.accept()
}
