import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink
} from 'react-router-dom'
import CodeEditor from 'react-simple-code-editor'
import Box from 'superbox'
import highlight, { PrismCSS } from './prism'

const Flex = props =>
  <Box
    {...props}
    css={{
      display: 'flex',
      ...props.css,
    }}
  />

const Main = props =>
  <Box
    {...props}
    width={1}
    css={{
      height: '100vh'
    }}
  />

const SideBar = props =>
  <Box
    {...props}
    width={[ 128, 320, 512 ]}
    css={{
      flex: 'none',
      height: '100vh'
    }}
  />

const DefaultProvider = props =>
  <Box
    {...props}
    mx='auto'
    px={3}
    py={4}
    css={{
      maxWidth: '768px'
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
    return (
      <Box px={3} py={3}
        css={{
          fontFamily: 'Menlo, monospace',
          fontSize: '13px',
          '& textarea': {
            outline: 'none'
          }
        }}
      >
        <CodeEditor
          ref={this.editor}
          value={code}
          onValueChange={code => {
            this.handleChange(code)
          }}
          highlight={code => highlight(code)}
          style={{
            height: '100vh',
          }}
        />
      </Box>
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
          <Switch>
            {routes.map(({ Component, ...route }) => (
              <Route
                {...route}
                render={state => (
                  <Flex>
                    <Main>
                      <DefaultProvider>
                        <Component />
                      </DefaultProvider>
                    </Main>
                    <SideBar>
                      <PrismCSS>
                        <Editor
                          code={route.code}
                          path={route.path}
                          onChange={this.writeFile(route.key)}
                        />
                      </PrismCSS>
                    </SideBar>
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

// if (module.hot) { module.hot.accept() }
