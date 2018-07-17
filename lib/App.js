import React from 'react'
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
import Box from 'superbox'

const Flex = props =>
  <Box
    {...props}
    css={{
      display: 'flex',
      ...props.css,
    }}
  />

class Editor extends React.Component {
  state = {
    code: this.props.code
  }

  editor = React.createRef()

  handleChange = code => {
    this.setState({ code })
    this.props.onChange(code)
  }

  shouldComponentUpdate (props, state) {
    if (state.code !== this.state.code) return true
    if (props.path !== this.props.path) return true
    return false
  }

  componentDidMount () {
    if (!this.editor.current || !this.editor.current._input) return
    this.editor.current._input.focus()
  }

  render () {
    const { code } = this.state
    console.log('Editor', code, this.props)
    return (
      <CodeEditor
        ref={this.editor}
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
    routes: [] // this.props.routes
  }

  writeFile = (filename) => (content) => {
    if (!this.socket) return
    console.log('write', filename, content)
    const json = JSON.stringify({ filename, content })
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
