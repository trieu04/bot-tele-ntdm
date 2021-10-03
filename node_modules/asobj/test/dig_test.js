/**
 * Test case for dig.
 * Runs with mocha.
 */
'use strict'

const dig = require('../lib/dig.js')
const assert = require('assert')


describe('dig', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Dig', async () => {
    assert.equal(dig({ foo: 'bar' }, 'foo'), 'bar')
    assert.equal(dig({ foo: { bar: 'baz' } }, 'foo', 'bar'), 'baz')
  })
})

/* global describe, before, after, it */
