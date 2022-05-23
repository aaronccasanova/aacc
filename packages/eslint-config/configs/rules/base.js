/**
 * @type {import('eslint').Linter.RulesRecord}
 */
module.exports = {
  'import/prefer-default-export': 'off',
  'react/require-default-props': [
    'off',
    {
      functions: 'defaultArguments',
    },
  ],
  'no-restricted-syntax': [
    'error',
    'ForInStatement',
    'LabeledStatement',
    'WithStatement',
  ],
  '@typescript-eslint/no-use-before-define': 'off',
}
