/**
 * Test case for clone.
 * Runs with mocha.
 */
'use strict'

const clone = require('../lib/clone.js')
const assert = require('assert')

describe('clone', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Clone', async () => {
    const obj = clone({
      foo: 'bar',
      baz: 'quz',
    }, {
      without: 'baz'
    })
    assert.deepEqual(obj, {foo: 'bar'})
  })

  it('Clone without regx', async () => {
    const obj = clone({
      f: 'f',
      foo: 'bar',
      baz: 'quz',
      baz2: 'quz2',
      $hoge: 'this is hoge'
    }, {
      without: [/^ba/, '$hoge', 'f']
    })
    assert.deepEqual(obj, {foo: 'bar'})
  })
})

/* global describe, before, after, it */
