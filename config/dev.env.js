'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  URLBASE: '"http://localhost:8080"',
  BOX_ENV: '"dev"'
})
