/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: ['@aacc/eslint-config/typescript'],
  globals: {
    globalThis: 'writeable',
    Deno: 'readable',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'import/extensions': ['error', 'always'],
    // Consider disabling globally. I have no issues using `_` to indicate private or unused
    'no-underscore-dangle': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
  overrides: [
    {
      files: ['examples/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
}
