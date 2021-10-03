/**
 * Test case for deepEqual.
 * Runs with mocha.
 */
'use strict'

const deepEqual = require('../lib/deep_equal.js')
const assert = require('assert')


describe('deep-equal', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Deep equal', async () => {
    assert.ok(
      deepEqual([ 'foo', 'bar' ], [ 'foo', 'bar' ])
    )
    assert.ok(
      !deepEqual([ 'foo', 'bar' ], [ 'foo', 'baz' ])
    )
    assert.ok(
      deepEqual({ foo: 'bar' }, { foo: 'bar' })
    )
    assert.ok(
      !deepEqual({ foo: 'bar' }, { foo: 'baz' })
    )
  })
})

/* global describe, before, after, it */
