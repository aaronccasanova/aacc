/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: ['@aacc/eslint-config'],
  ignorePatterns: ['node_modules', 'dist'],
}
