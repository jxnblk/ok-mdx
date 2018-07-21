import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  withRouter,
  Link
} from 'react-router-dom'
import AceEditor from 'react-ace'
import Box from 'superbox/isocss'
import 'brace/mode/jsx'
import 'brace/theme/monokai'
import './ace-theme'
import 'brace/keybinding/vim'
import { Burger } from 'reline'
import Folder from 'rmdi/lib/Folder'
import File from 'rmdi/lib/InsertDriveFile'
import Logo from './Logo'

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
      position: 'relative',
      flex: '1 1 auto',
      height: '100vh'
    }}
  />

const SideBar = props =>
  <Box
    width={props.width}
    css={{ flex: 'none' }}>
    <Box
      {...props}
      css={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        flex: 'none',
        height: '100vh'
      }}
    />
  </Box>
SideBar.defaultProps = {
  width: [ 192, 320, 512 ]
}

const Pre = props =>
  <Box
    mt={0}
    mb={0}
    is='pre'
    fontSize={13}
    {...props}
    css={{
      fontFamily: 'Menlo, monospace',
      whiteSpace: 'pre-wrap'
    }}
  />

const Container = props =>
  <Box
    mx='auto'
    px={3}
    py={4}
    {...props}
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

  handleChange = code => {
    this.setState({ code })
    this.props.onChange(code)
  }

  shouldComponentUpdate (props, state) {
    if (!props.focused) return true
    if (state.code !== this.state.code) return true
    if (props.path !== this.props.path) return true
    if (props.vim !== this.props.vim) return true
    return false
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
          value={code}
          onChange={this.handleChange}
          keyboardHandler={vim ? 'vim' : null}
          mode='jsx'
          theme='zero'
          width='100%'
          height='100%'
          tabSize={2}
          focus
          wrapEnabled
          debounceChangePeriod={400}
        />
      </Box>
    )
  }
}

const StatusBar = ({
  percent,
  status,
  focused
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
        mt={0}
        mb={1}
        css={{
          fontFamily: 'Menlo, monospace',
          fontSize: '13px'
        }}
        color={status ? 'cyan' : 'gray'}>
        {status ? status : 'ready'}
      </Box>
      {false && <Progress value={percent} />}
    </Box>
    <Box
      ml='auto'
      px={2}
      is={Link}
      to='/_directory'
      title='Show directory'
      css={{
        color: 'inherit',
        display: 'block'
      }}>
      <Burger />
    </Box>
  </Flex>

const Toolbar = props =>
  <Flex
    color='white'
    bg='#111'
    css={{
      height: '48px',
      alignItems: 'center'
    }}>
    <Pre px={2} width={2/3}>
      {props.file}
    </Pre>
    <Box
      ml='auto'
      px={2}
      is={Link}
      to='/_directory'
      title='Show directory'
      css={{
        color: 'inherit',
        display: 'block'
      }}>
      <Burger />
    </Box>
  </Flex>

const Directory = ({
  dirname,
  routes = []
}) =>
  <Flex
    color='white'
    bg='black'
    css={{
      alignItems: 'center',
      minHeight: '100vh'
    }}>
    <Container>
      <Flex css={{ alignItems: 'center' }}>
        <Folder mr={3} style={{ opacity: 0.5 }} />
        <Pre>
          {dirname}
        </Pre>
      </Flex>
      <Box
        is='ul'
        p={0}
        css={{
          listStyle: 'none'
        }}>
        {routes.map(route => (
          <li key={route.key}>
            <Flex
              is={Link}
              to={route.path}
              color='inherit'
              fontSize='13px'
              my={2}
              css={{
                alignItems: 'center',
                fontFamily: 'Menlo, monospace',
              }}>
              <File mr={3} style={{ opacity: 0.5 }} />
              {route.key}
            </Flex>
          </li>
        ))}
      </Box>
    </Container>
    <Box width={[ 128, 256, 512 ]}>
      <Logo />
    </Box>
  </Flex>

const Disconnected = () =>
  <Box
    color='white'
    bg='#555'
    css={{
      minHeight: '100vh'
    }}>
    <Flex
      css={{
        height: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box
        is='img'
        css={{
          mixBlendMode: 'screen'
        }}
        src='https://upload.wikimedia.org/wikipedia/commons/1/1f/Sad_mac.png'
      />
      <Pre py={3}>
        Disconnected from server
      </Pre>
    </Flex>
  </Box>

const Err = ({ error }) => {
  return (
    <Box
      color='white'
      bg='#333'
      p={3}
      css={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: 'auto'
      }}>
      <Pre color='red' mb={4}>
        {error.text}
      </Pre>
      <Pre
        bg='rgba(0, 0, 0, .125)'
        dangerouslySetInnerHTML={{
          __html: error.code
        }}
      />
    </Box>
  )
}

const App = withRouter(class extends React.Component {
  static defaultProps = {
    ...OPTIONS,
    dirname: DIRNAME
  }

  state = {
    focused: true,
    routes: [],
    percent: 0,
    status: '',
    error: null
  }

  writeFile = (filename) => (content) => {
    if (!this.socket) return
    const json = JSON.stringify({ filename, content })
    this.socket.send(json)
  }

  handleFocus = e => {
    this.setState({ focused: true })
  }

  handleBlur = e => {
    this.setState({ focused: false })
  }

  componentDidMount () {
    this.socket = new WebSocket('ws://localhost:' + SOCKET_PORT)
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify('boop'))
    }
    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.error) {
        console.error(data.error)
        this.setState({ error: data.error })
      } else {
        console.log(data)
        this.setState({ error: null })
      }
    }
    this.socket.onclose = () => {
      this.props.history.push('/_disconnected')
    }

    /* debounce or figure out performant way of handling
    this.progress = new WebSocket('ws://localhost:' + PROGRESS_PORT)
    this.progress.onmessage = msg => {
      const { percent, status } = JSON.parse(msg.data)
      this.setState({ percent, status })
    }
    */

    window.addEventListener('focus', this.handleFocus)
    window.addEventListener('blur', this.handleBlur)
    if (this.props.location.pathname === '/_disconnected') {
      this.props.history.push('/')
    }
  }

  render () {
    const { percent, status } = this.state
    const { Provider, routes, vim } = this.props

    const Wrap = Provider || Container

    return (
      <React.Fragment>
        <Switch>
          {routes.map(({ Component, ...route }) => (
            <Route
              {...route}
              render={state => (
                <Flex>
                  <Main>
                    <Wrap>
                      <Catch>
                        <Component />
                        {this.state.error && <Err {...this.state} />}
                      </Catch>
                    </Wrap>
                  </Main>
                  <SideBar>
                    <Toolbar file={route.key} {...route} />
                    <Editor
                      vim={vim}
                      code={route.code}
                      path={route.path}
                      onChange={this.writeFile(route.key)}
                      focused={this.state.focused}
                    />
                  </SideBar>
                </Flex>
              )}
            />
          ))}
          <Route
            path='/_disconnected'
            render={() => (
              <Disconnected />
            )}
          />
          <Route
            render={state => (
              <Directory {...this.props} routes={routes} />
            )}
          />
        </Switch>
      </React.Fragment>
    )
  }
})

export default class Root extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <App {...this.props} />
      </BrowserRouter>
    )
  }
}
if (module.hot) { module.hot.accept() }
