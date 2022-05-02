/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    ...require('./rules/base'),
    '@typescript-eslint/semi': 'off',
  },
  // Consumers must define this parser options in their .eslintrc
  // parserOptions: {
  //   project: './tsconfig.json',
  // },
}
