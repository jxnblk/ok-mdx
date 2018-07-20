#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const meow = require('meow')
const open = require('react-dev-utils/openBrowser')
const chalk = require('chalk')
// const log = require('./lib/log')

const log = (...args) => {
  console.log(
    chalk.cyan('[mdx]'),
    ...args
  )
}
log.error = (...args) => {
  console.log(
    chalk.red('[err]'),
    ...args
  )
}

const config = require('pkg-conf').sync('ok-mdx')

const cli = meow(`
  Usage:

    $ mdx docs

  Options:

    -o --open     Opens development server in default browser
    -p --port     Port for development server
    --vim         Enable editor Vim mode

`, {
  flags: {
    open: {
      type: 'boolean',
      alias: 'o'
    },
    port: {
      type: 'string',
      alias: 'p'
    },
    vim: {
      type: 'boolean',
    },
  }
})

const [ cmd, dir ] = cli.input
if (!cmd) {
  cli.showHelp(0)
}
const dirname = path.resolve(dir || cmd)

const opts = Object.assign({
  dirname,
  port: 8080,
  title: 'ok-mdx',
}, config, cli.flags)

switch (cmd) {
  case 'dev':
  default:
    const dev = require('./lib/dev')
    log(`starting dev server (${dir || cmd})`)
    dev(opts)
      .then(({ server }) => {
        const { port } = server.options
        const url = `http://localhost:${port}`
        log('dev server listening on', chalk.cyan(url))
        if (opts.open) open(url)
      })
      .catch(err => {
        log.error(err)
        process.exit(1)
      })
}

require('update-notifier')({
  pkg: cli.pkg
}).notify()
