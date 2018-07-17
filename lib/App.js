import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import CodeEditor from 'react-simple-code-editor'
import Box from 'superbox'
import highlight, { PrismCSS } from './prism'

class Catch extends React.Component {
  state = {
    err: null
  }

  componentDidUpdate (prev) {
    if (prev.children !== this.props.children) {
      this.setState({ err: null })
    }
  }

  componentDidCatch (err) {
    console.error(err)
    this.setState({ err })
  }

  render () {
    const { err } = this.state
    if (err) {
      return (
        <Box
          is='pre'
          color='white'
          bg='red'
          p={2}
          children={err.toString()}
        />
      )
    }
    try {
      return (
        <React.Fragment>
          {this.props.children}
        </React.Fragment>
      )
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

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

const Directory = ({ routes = [] }) =>
  <ul>
    {routes.map(route => (
      <li key={route.key}>
        <Link to={route.path}>
          {route.key}
        </Link>
      </li>
    ))}
  </ul>

export default class App extends React.Component {
  static defaultProps = {
    ...OPTIONS,
  }

  state = {
    routes: [] // this.props.routes
  }

  writeFile = (filename) => (content) => {
    if (!this.socket) return
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
                        <Catch>
                          <Component />
                        </Catch>
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
            <Route
              render={state => (
                <Directory routes={routes} />
              )}
            />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

// if (module.hot) { module.hot.accept() }
