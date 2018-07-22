
# ok-mdx

<img src='docs/ok-mdx.gif' />

Browser-based [MDX][] editor

```sh
npm i -g ok-mdx
```

```sh
mkdir docs
touch docs/hello.mdx
mdx docs --open
```

- Quickly prototype with React components
- Zero configuration
- Mix markdown with JSX
- Live edit and autosave

## What is this for?

MDX is great for documentation, building demos, or quickly prototyping with React components,
without the need to set up a full-blown React application.
Similar to [Compositor x0][x0], ok-mdx is meant to be installed as a global command line utility
that you can use alongside your application setup or in isolated sandbox environments.
ok-mdx works well as a local alternative to tools like [CodeSandbox][] when working with React components.

## Getting Started

ok-mdx needs a directory of `.mdx` or `.md` files to work.

After installing ok-mdx, create a folder and an empty `.mdx` file with the following command:

```sh
mkdir docs && touch docs/hello.mdx
```

Start ok-mdx with the following:

```sh
mdx docs --open
```

This will open the application in your default browser, showing a list of the MDX files.
Click on a filename to open the editor view.
In the right panel, add some text to see the preview on the left.

### MDX Format

MDX is a superset of [markdown][], which can also render [JSX][] instead of HTML.

```mdx
# Markdown Heading

<button className='blue'>JSX button</button>
```

### Importing Components

In order to import components, be sure they're installed locally.
This requires a `package.json` file in your current directory.

To create a `package.json` file, run `npm init -y`.

To install a component, use `npm install`. The following will install [grid-styled][] and [styled-components][] as a local dependency.

```sh
npm i grid-styled styled-components
```

To use components, import them at the top of your MDX file:

```mdx
import { Flex, Box } from 'grid-styled'

# Hello

<Flex alignItems='center'>
  <Box p={3} width={1/2} bg='blue'>
    Flex
  </Box>
  <Box p={3} width={1/2}>
    Box
  </Box>
</Flex>
```

## Options

```
-o --open     Opens development server in default browser
-p --port     Port for development server
--vim         Enable editor Vim mode
```

### Exporting

ok-mdx is only meant to be used for development. To export your MDX files, consider one of the following tools:

- [Compositor x0][x0]
- [Next.js][next.js]

## Related

- [Compositor x0][x0]
- [Compositor Iso][iso]
- [MDX][]
- [CodeSandbox][]

[x0]: https://github.com/c8r/x0
[iso]: https://compositor.io/iso
[MDX]: https://github.com/mdx-js/mdx
[CodeSandbox]: https://codesandbox.io
[markdown]: https://daringfireball.net/projects/markdown/syntax
[JSX]: https://facebook.github.io/jsx/
[grid-styled]: https://github.com/jxnblk/grid-styled
[styled-components]: https://github.com/styled-components/styled-components
[next.js]: https://github.com/zeit/next
