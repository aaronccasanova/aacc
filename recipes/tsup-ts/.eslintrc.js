/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: ['@aacc/eslint-config/typescript'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
  },
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { packageDir: [__dirname] }],
  },
}
