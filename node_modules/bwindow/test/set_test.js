/**
 * Test case for set.
 * Runs with mocha.
 */
'use strict'

const set = require('../lib/set.js')
const {deepEqual} = require('assert')

describe('set', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Set', async () => {
    global.window = {}
    set('foo.bar', 'baz')
    deepEqual(global.window, {foo: {bar: 'baz'}})
    delete global.window
  })
})

/* global describe, before, after, it */
