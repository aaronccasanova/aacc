/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['next/core-web-vitals', '@aacc/eslint-config/typescript'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
  ignorePatterns: ['node_modules', '.next'],
}
