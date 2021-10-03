#!/usr/bin/env node

/**
 * Generate shim
 */

'use strict'

process.chdir(`${__dirname}/..`)

const { runTasks } = require('ape-tasking')
const ababel = require('ababel')

runTasks('shim', [
  () => ababel('**/*.js', {
    cwd: 'lib',
    out: 'shim/browser'
  }),
  () => ababel('**/*.js', {
    cwd: 'vendor',
    out: 'shim/vendor'
  })
], true)
