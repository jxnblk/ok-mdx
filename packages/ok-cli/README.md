
# ok-cli

<img src='https://s3.amazonaws.com/jxnblk/ok-cli.mp4' />

Hyperminimal dev server for React & [MDX][]

- :zero: Zero config
- :headphones: No plugins
- 🧠 Smart defaults
- :atom_symbol: Render React or MDX
- :fire: Blazing

```sh
npm i -g ok-cli
```

```sh
ok docs/hello.mdx
```

## Using React

ok-cli will render the default exported component of a module.

```jsx
// example App.js
import React from 'react'

export default props =>
  <h1>Hello</h1>
```

```sh
ok docs/App.js
```

## Using MDX

MDX is a superset of [markdown][],
which lets you mix [JSX][] with markdown syntax.

```mdx
import Button from './Button'

# Markdown Heading

<Button>React Component</Button>
```

### Layouts

MDX also supports [layouts][] with React components.
The default export in an MDX file will wrap the contents of the document.

```jsx
// example Layout.js
import React from 'react'

export default ({ children }) =>
  <div
    style={{
      padding: 32,
      maxWidth: 768,
      margin: 'auto'
    }}>
    {children}
  </div>
```

```mdx
import Layout from './Layout'

export default Layout

# Hello
```

### Components

ok-cli has built-in support for customizing the [components][] used in MDX.
Export a named `components` object from the MDX document to customize the MDX markdown components.

```jsx
// example components.js
import React from 'react'

export default {
  h1: props => <h1 {...props} style={{ color: 'tomato' }} />
}
```

```mdx
export { default as components } from './components'

# Hello
```

## Options

- `--port`, `-p` Port for the dev server
- `--no-open` Prevent opening in default browser

## Node API

```js
const start = require('ok-cli')

const options = {
  entry: './src/App.js'
}

start(options)
  .then(({ app, middleware, port }) => {
    console.log('listening on port:', port)
  })
```

MIT License

[x0]: https://compositor/x0
[MDX]: https://github.com/mdx-js/mdx
[markdown]: https://daringfireball.net/projects/markdown/syntax
[JSX]: https://facebook.github.io/jsx/
[layouts]: https://github.com/mdx-js/mdx#export-default
[components]: https://github.com/mdx-js/mdx#component-customization
