/**
 * Test case for cleanup.
 * Runs with mocha.
 */
'use strict'

const cleanup = require('../lib/cleanup.js')
const {equal} = require('assert')

describe('cleanup', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Cleanup', async () => {
    let foo
    const values = {
      foo,
      bar: 'This is bar'
    }
    equal(Object.keys(values).length, 2)
    cleanup(values)
    equal(Object.keys(values).length, 1)
  })

  it('Cleanup null', async () => {
    let foo
    const values = {
      foo,
      bar: 'This is bar',
      baz: null
    }
    equal(Object.keys(values).length, 3)
    cleanup(values, {delNull: true})
    equal(Object.keys(values).length, 1)
  })

  it('Cleanup empty string', async () => {
    let foo
    const values = {
      foo,
      bar: 'This is bar',
      baz: ''
    }
    equal(Object.keys(values).length, 3)
    cleanup(values, {delEmptyString: true})
    equal(Object.keys(values).length, 1)
  })
})

/* global describe, before, after, it */
