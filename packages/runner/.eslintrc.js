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
  ignorePatterns: [
    'node_modules',
    'dist',
    // TODO: Remove after benchmarking..
    'examples',
  ],
  overrides: [
    {
      files: 'rollup.config.mjs',
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
