/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    ...require('./rules/base'),
  },
}
