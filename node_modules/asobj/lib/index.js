/**
 * Object utility
 * @module asobj
 */

'use strict'


const assign = require('./assign')
const cleanup = require('./cleanup')
const clone = require('./clone')
const deepEqual = require('./deep_equal')
const dig = require('./dig')
const keyFor = require('./key_for')
const retrieve = require('./retrieve')
const shallowEqual = require('./shallow_equal')

exports.assign = assign
exports.cleanup = cleanup
exports.clone = clone
exports.deepEqual = deepEqual
exports.dig = dig
exports.keyFor = keyFor
exports.retrieve = retrieve
exports.shallowEqual = shallowEqual

module.exports = {
  assign,
  cleanup,
  clone,
  deepEqual,
  dig,
  keyFor,
  retrieve,
  shallowEqual
}
