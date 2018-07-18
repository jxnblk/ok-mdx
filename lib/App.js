import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import AceEditor from 'react-ace'
import Box from 'superbox'
import 'brace/mode/jsx'
import 'brace/theme/monokai'
import 'brace/keybinding/vim'

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
      flex: '1 1 auto',
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

const Progress = ({ value }) =>
  <Box width={1} bg='rgba(255,255,255, 0.125)'>
    <Box
      bg='cyan'
      style={{
        height: 4,
        width: (value * 100) + '%'
      }}
    />
  </Box>

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
    if (props.vim !== this.props.vim) return true
    return false
  }

  componentDidMount () {
    // if (!this.editor.current || !this.editor.current._input) return
    // this.editor.current._input.focus()
  }

  render () {
    const { vim } = this.props
    const { code } = this.state
    return (
      <Box
        css={{
          height: 'calc(100vh - 48px)'
        }}
      >
        <AceEditor
          mode='jsx'
          theme='monokai'
          width='100%'
          height='100%'
          focus
          value={code}
          keyboardHandler={vim ? 'vim' : null}
          onChange={this.handleChange}
        />
      </Box>
    )
  }
}

const StatusBar = ({
  percent,
  status
}) =>
  <Flex
    color='white'
    bg='black'
    css={{
      height: '48px',
      alignItems: 'center'
    }}>
    <Box px={2} width={2/3}>
      <Box
        is='pre'
        mt={1}
        mb={0}
        css={{
          fontFamily: 'Menlo, monospace',
          fontSize: '13px'
        }}
        color={status ? 'cyan' : 'gray'}>
        {status ? status : 'ready'}
      </Box>
      <Progress value={percent} />
    </Box>
    <Box
      ml='auto'
      px={2}
      is={Link}
      to='/dir'
      css={{}}>
      Dir
    </Box>
  </Flex>

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
    routes: [],
    percent: 0,
    status: ''
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
    this.socket.onclose = () => {
      window.location.reload()
    }
    this.progress = new WebSocket('ws://localhost:' + PROGRESS_PORT)
    this.progress.onmessage = msg => {
      const { percent, status } = JSON.parse(msg.data)
      this.setState({ percent, status })
    }
  }

  render () {
    const { routes, percent, status } = this.state
    const { vim } = this.props

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
                      <Editor
                        vim={vim}
                        code={route.code}
                        path={route.path}
                        onChange={this.writeFile(route.key)}
                      />
                      <StatusBar {...this.state} />
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
