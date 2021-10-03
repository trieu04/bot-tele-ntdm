/**
 * Test case for shallowEqual.
 * Runs with mocha.
 */
'use strict'

const shallowEqual = require('../lib/shallow_equal.js')
const assert = require('assert')


describe('shallow-equal', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Shallow equal', async () => {
    assert.ok(shallowEqual({ foo: 'bar' }, { foo: 'bar' }))
    assert.ok(!shallowEqual({ foo: 'bar' }, { foo: 'baz' }))
  })
})

/* global describe, before, after, it */
