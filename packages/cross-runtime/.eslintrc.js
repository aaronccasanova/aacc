/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: ['@aacc/eslint-config/typescript'],
  globals: {
    globalThis: 'writeable',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules', 'dist'],
}
