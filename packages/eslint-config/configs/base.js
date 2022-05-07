/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    'airbnb',
    // Prettier must comes last to override configs that include formatting rules
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    ...require('./rules/base'),
  },
}
