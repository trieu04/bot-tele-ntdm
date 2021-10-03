/**
 * Test case for retrieve.
 * Runs with mocha.
 */
'use strict'

const retrieve = require('../lib/retrieve.js')
const assert = require('assert')
const {equal} = assert

describe('retrieve', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Retrieve', async () => {
    equal(
      retrieve({a: {b: {c: 1}}}, 'a.b.c'),
      1,
    )

    equal(
      retrieve({'a.b.c': 2}, 'a.b.c'),
      2,
    )
  })
})

/* global describe, before, after, it */
