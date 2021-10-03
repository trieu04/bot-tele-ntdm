/**
 * Get key for value
 * @function keyFor
 * @param {Object}
 * @param {*}
 * @returns {string}
 */
'use strict'

/** @lends keyFor */
function keyFor (obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value)
}

module.exports = keyFor
