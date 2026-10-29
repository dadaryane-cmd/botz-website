import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      // CMS documents are loosely typed JSON in a few rendering helpers.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // The static site: clean, readable plain JavaScript (see CLAUDE.md).
    files: ['site/**/*.js'],
    rules: {
      'no-nested-ternary': 'error',
      'no-sequences': 'error',
      'no-return-assign': ['error', 'always'],
      curly: ['error', 'multi-line', 'consistent'],
      'id-length': ['error', { min: 2, exceptions: ['i', 'x', 'y', 't', 'h'], properties: 'never' }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    ignores: ['.next/', 'src/payload-types.ts', 'src/payload-generated-schema.ts', 'src/migrations/', 'src/app/(payload)/admin/importMap.js'],
  },
]

export default eslintConfig
