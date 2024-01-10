/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    'jsx-quotes': ['error', 'prefer-single'],
    'quotes': ['error', 'single'],
    'no-var': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: 'Using "import [module] from lodash/[module]" instead',
          },
        ],
      },
    ],
    'indent': ['error', 2, { 'ignoredNodes': ['PropertyDefinition'] }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': 'error',
    'semi': 'error',
  },
};
