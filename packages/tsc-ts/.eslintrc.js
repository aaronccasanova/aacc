/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['@aacc/eslint-config/typescript'],
  // files: ['*.ts', '*.tsx'],
  parserOptions: {
    // tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
