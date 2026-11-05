import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['site/dist/'] },
  js.configs.recommended,
  {
    // The website: browser modules (public/) and the Node tools that build and test it.
    files: ['site/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    // Clean, readable plain JavaScript (see CLAUDE.md).
    rules: {
      'no-nested-ternary': 'error',
      'no-sequences': 'error',
      'no-return-assign': ['error', 'always'],
      curly: ['error', 'multi-line', 'consistent'],
      'id-length': ['error', { min: 2, exceptions: ['i', 'x', 'y', 't', 'h'], properties: 'never' }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'smart'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
]
