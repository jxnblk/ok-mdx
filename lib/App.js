import path from 'path'
import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter,
  Route,
  Switch,
  NavLink
} from 'react-router-dom'
import {
  LiveProvider,
  LivePreview,
  LiveError,
  LiveEditor,
  withLive
} from 'react-live'
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

// needs state to work as an uncontrolled input
const Editor = withLive(({
  live: {
    code = '',
    error,
    onChange,
    onError,
    element,
  } = {},
  ...props
}) =>
  <div>
    <CodeEditor
      {...props}
      value={code}
      onValueChange={code => {
        console.log('change', code)
        // onChange('beep')
        onChange(code)
      }}
      highlight={code => highlight(code, languages.js)}
    />
    <Box is='pre'>
      code: {code}
    </Box>
  </div>
)

const req = require.context(DIRNAME, true, /\.(md|mdx|jsx)$/)

const routes = req.keys()
  .filter(key => !/node_modules/.test(key))
  .map(key => {
    const extname = path.extname(key)
    const name = path.basename(key, extname)
    const exact = name === 'index'
    const dirname = path.dirname(key).replace(/^\./, '')
    const pathname = dirname + '/' + (exact ? '' : name)
    const code = req(key)
    return {
      key,
      name,
      extname,
      dirname,
      exact,
      path: pathname,
      code
    }
  })

const REG = /^(\s)*export default \({components}\) =>/
const transformMDX = code => {
  const js = mdx.sync(code).trim()
  const jsx = js.replace(REG, '').trim()
  return jsx
}

const View = ({
  code
}) =>
  <LiveProvider
    code={code}
    mountStylesheet={false}
    transformCode={transformMDX}
    scope={{
      // for MDX
      components: {},
      MDXTag
    }}
  >
    <Flex>
      <Box bg='blue' width={1}>
        <LiveError />
        <LivePreview />
      </Box>
      <Box
        width={320}
        bg='lightgray'
        css={{ flex: 'none' }}>
        <LiveEditor />
      </Box>
    </Flex>
  </LiveProvider>

export default class App extends React.Component {
  static defaultProps = {
    ...OPTIONS,
    routes
  }

  render () {
    const { routes } = this.props

    return (
      <BrowserRouter>
        <React.Fragment>
          <h1>ok-mdx</h1>
          <Switch>
            {routes.map(route => (
              <Route
                {...route}
                render={state => (
                  <View {...route} />
                )}
              />
            ))}
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

render(<App />, root)

if (module.hot && module.hot.accept) {
  module.hot.accept()
}
