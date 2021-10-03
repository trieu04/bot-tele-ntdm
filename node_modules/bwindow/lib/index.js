/**
 * Browser window accessor
 * @module bwindow
 */

'use strict'


const get = require('./get')
const once = require('./once')
const set = require('./set')

exports.get = get
exports.once = once
exports.set = set

module.exports = {
  get,
  once,
  set
}
