/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [require.resolve('./base')],
  rules: {
    ...require('./rules/node'),
  },
}
