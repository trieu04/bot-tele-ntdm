/**
 * Test case for assign.
 * Runs with mocha.
 */
'use strict'

const assign = require('../lib/assign.js')
const assert = require('assert')

describe('assign', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Assign', async () => {
    let assigned = assign({
      foo: 'This is foo'
    }, {
      bar: 'This is bar'
    })
    assert.deepEqual(assigned, {
      foo: 'This is foo', bar: 'This is bar'
    })
  })
})

/* global describe, before, after, it */
