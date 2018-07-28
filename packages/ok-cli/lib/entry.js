import React from 'react'
import { render } from 'react-dom'

const mod = require(APP_FILENAME)
const App = mod.default
const { components = {} } = mod
render(<App components={components} />, window.root)

console.log(mod)
if (module.hot) module.hot.accept()
