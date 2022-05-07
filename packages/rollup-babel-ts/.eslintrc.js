/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@aacc/eslint-config/typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
}
