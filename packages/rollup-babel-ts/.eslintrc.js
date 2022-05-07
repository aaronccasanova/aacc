/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@aacc/eslint-config/typescript'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
}
