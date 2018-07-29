const path = require('path')
const test = require('ava')
const request = require('supertest')
const start = require('./lib')

const util = require('util')

let server

test.serial('starts', async t => {
  const res = await start({
    entry: path.join(__dirname, './docs/hello.mdx')
  })
  t.is(typeof res, 'object')
  t.is(typeof res.app, 'object')
  t.is(typeof res.middleware, 'function')
  t.is(typeof res.port, 'number')
  server = res.server
})

test('returns html', async t => {
  const res = await request(server).get('/')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=UTF-8')
  t.is(typeof res.text, 'string')
})

test('serves bundled.js', async t => {
  const res = await request(server).get('/main.js')
    .expect(200)
    .expect('Content-Type', 'application/javascript; charset=UTF-8')
  t.is(typeof res.text, 'string')
})
