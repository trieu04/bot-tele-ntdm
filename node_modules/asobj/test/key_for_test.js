/**
 * Test case for keyFor.
 * Runs with mocha.
 */
'use strict'

const keyFor = require('../lib/key_for.js')
const {equal} = require('assert')

describe('key-for', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Key for', async () => {
    equal(
      keyFor({a: 1, b: 2}, 2),
      'b'
    )
  })
})

/* global describe, before, after, it */
