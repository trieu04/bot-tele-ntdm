/**
 * Delete undefined properties.
 * @function cleanup
 * @param {Object} values - Values to cleanup
 * @param {Object} [options] - Optional settings
 * @param {boolean} [options.delNull=false] - Should delete null property
 * @param {boolean} [options.delEmptyString=false] - Should delete emptyString property
 * @returns {Object} - Clean value
 */
'use strict'

/** @lends cleanup */
function cleanup (values, options = {}) {
  if (!values) {
    return values
  }
  const {
    delNull = false,
    delEmptyString = false,
  } = options
  for (const name of Object.keys(values)) {
    const value = values[name]
    const shouldClean = (typeof value === 'undefined') ||
      (delNull && value === null) ||
      (delEmptyString && value === '')
    if (shouldClean) {
      delete values[name]
    }
  }
  return values
}

module.exports = cleanup
