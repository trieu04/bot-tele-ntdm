/**
 * Retrieve attribute value from object
 * @function retrieve
 * @param {Object} obj - Obj to retrieve with
 * @param {string} name - Name path
 * @returns {*}
 */
'use strict'

/** @lends retrieve */
function retrieve (obj, name) {
  if (name in obj) {
    return obj[name]
  }
  const namepaths = name.split('.')
  let value = obj
  while (namepaths.length) {
    if (!value) {
      return value
    }
    value = value[namepaths.shift()]
  }
  return value
}

module.exports = retrieve
