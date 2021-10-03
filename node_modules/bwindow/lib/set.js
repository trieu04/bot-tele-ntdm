/**
 * Set object to window
 * @function set
 * @param {string} name - Name of object
 * @param {*} value - Value to set
 * @param {Object} [options] - Optional settings
 * @param {boolean} [options.strict] - Throws error when not found.
 * @returns {?Object}
 */
'use strict'

const _window = () => {
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof self !== 'undefined') {
    return self
  }
  return null
}

/** @lends set */
function set (name, value, options = {}) {
  const window = _window()
  const keys = name.split(/\./g)
  let target = window
  while (keys.length > 1) {
    const key = keys.shift()
    target[key] = target[key] || {}
    target = target[key]
  }
  const failed = options.strict && !target
  if (failed) {
    throw new Error(`${name} not found!`)
  }
  target[keys.shift()] = value
}

module.exports = set
