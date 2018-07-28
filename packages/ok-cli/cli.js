#!/usr/bin/env node
const path = require('path')
const meow = require('meow')
const start = require('./lib')
const open = require('react-dev-utils/openBrowser')
const clipboard = require('clipboardy')
const chalk = require('chalk')

const log = (...args) => {
  console.log(
    chalk.magenta('[ok]'),
    ...args
  )
}

log.error = (...args) => {
  console.log(
    chalk.red('[err]'),
    ...args
  )
}

const cli = meow(`
  ${chalk.magenta('[ok]')}

  ${chalk.gray('Usage:')}

    ${chalk.magenta('$ ok pages/hello.mdx')}

    ${chalk.magenta('$ ok pages/App.js')}

  ${chalk.gray('Options:')}

    ${chalk.magenta('-p --port')}   Development server port

    ${chalk.magenta('--no-open')}   Prevent from opening in default browser


`, {
  flags: {
    port: {
      type: 'string',
      alias: 'p'
    },
    open: {
      type: 'boolean',
      alias: 'o',
      default: true
    },
    help: {
      type: 'boolean',
      alias: 'h'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    }
  }
})

const [ entry ] = cli.input

if (!entry) {
  cli.showHelp(0)
}

const opts = Object.assign({
  entry: path.resolve(entry)
}, cli.flags)

log('starting dev server')

start(opts)
  .then(({ port, app, middleware }) => {
    const url = `http://localhost:${port}`
    clipboard.write(url)
    console.log()
    log('server listening on', chalk.magenta(url))
    if (opts.open) open(url)
  })
  .catch(err => {
    log.error(err)
    process.exit(1)
  })
