/**
 * Clone a object
 * @function clone
 * @param {Object} src - Source object to clone
 * @param {Object} [options={}] - Optional settings
 * @param {string[]|RegExp[]} [options.without] - Properties to skip
 * @returns {Object} - Cloned object
 */
'use strict'

/** @lends clone */
function clone (src, options = {}) {
  const cloned = Object.assign({}, src)

  const without = [].concat(options.without || [])
  for (const name of Object.keys(cloned)) {
    const shouldDelete = without.some((without) => (without.test && without.test(name)) || (name === without))
    if (shouldDelete) {
      delete cloned[name]
    }
  }
  return cloned
}

module.exports = clone
