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
    ecmaVersion: 2021, // Node.js 16
  },
  rules: {
    ...require('./rules/base'),
  },
}
