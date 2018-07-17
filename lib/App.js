import path from 'path'
import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink
} from 'react-router-dom'
import CodeEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import mdx from '@mdx-js/mdx'
import { MDXTag } from '@mdx-js/tag'
import Box from 'superbox'

const Flex = props =>
  <Box
    {...props}
    css={{
      display: 'flex',
      ...props.css,
    }}
  />

const req = require.context(DIRNAME, true, /\.(md|mdx|jsx)$/)
const codeContext = require.context('!!raw-loader!' + DIRNAME, true, /\.(md|mdx|jsx)$/)

const getRoutes = () => {
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

const REG = /^(\s)*export default \({components}\) =>/
const transformMDX = code => {
  const js = mdx.sync(code).trim()
  const jsx = js.replace(REG, '').trim()
  return jsx
}

class Editor extends React.Component {
  state = {
    code: this.props.code
  }
  editor = React.createRef()
  handleChange = code => {
    console.log('handlechange', code)
    this.setState({ code })
    this.props.onChange(code)
  }
  shouldComponentUpdate (props, state) {
    console.log('scu', props !== this.props, state !== this.state)
    if (state.code !== this.state.code) return true
    if (props.path !== this.props.path) return true
    return false

    if (props.path === this.props.path && props.code !== this.props.code) return false
    console.log('scu', props !== this.props)
    return props.path !== this.props.path
  }
  componentDidMount () {
    // if (!this.editor.current || !this.editor.current._input) return
    // this.editor.current._input.focus()
  }

  render () {
    const { code } = this.state
    console.log('Editor', code, this.props)
    return (
      <CodeEditor
        value={code}
        onValueChange={code => {
          this.handleChange(code)
        }}
        highlight={code => highlight(code, languages.js)}
      />
    )
  }
}

export default class App extends React.Component {
  static defaultProps = {
    ...OPTIONS,
  }

  state = {
    routes: getRoutes()
  }

  writeFile = (filename) => (content) => {
    if (!this.socket) return
    console.log('write', filename, content)
    const json = JSON.stringify({ filename, content })
    console.log(json)
    console.log(this.socket)
    this.socket.send(json)
  }

  componentDidMount () {
    this.socket = new WebSocket('ws://localhost:' + SOCKET_PORT)
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify('boop'))
    }
    this.socket.onmessage = (msg) => {
      console.log(msg.data)
    }
  }

  render () {
    const { routes } = this.state

    return (
      <BrowserRouter>
        <React.Fragment>
          <h1>ok-mdx</h1>
          <Switch>
            {routes.map(({ Component, ...route }) => (
              <Route
                {...route}
                render={state => (
                  <Flex>
                    <Box width={1}>
                      <Component />
                    </Box>
                    <Box width={320}>
                      <Editor
                        code={route.code}
                        path={route.path}
                        onChange={this.writeFile(route.key)}
                      />
                    </Box>
                  </Flex>
                )}
              />
            ))}
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

const app = render(<App />, root)

if (module.hot) {
  module.hot.decline()
  // module.hot.accept()
  module.hot.accept(req.id, () => {
    console.log('HOT')
    const routes = getRoutes()
    console.log('routes')
    app.setState({ routes })
  })
}
