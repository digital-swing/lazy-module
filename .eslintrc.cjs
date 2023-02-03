const tsConfig = require('./tsconfig.json');
const tsTestConfig = require('./tsconfig.test.json');

module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  ignorePatterns: [
    '**/node_modules/*.[tj]s',
    '**/vendor/*.[tj]s',
    '**/dist/**/*.[tj]s',
    '**/public/**/*.[tj]s',
    '**/build/**/*.[tj]s',
    '**/coverage',
  ],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'], // Specify it only for TypeScript files
  },
  plugins: [
    'import',
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-tsdoc',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  root: true,
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],

    // 'no-undef': 'warn',
    'func-names': 0,

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'webpack.config.cjs',
          'webpack.prod.cjs',
          'webpack.dev.cjs',
          'rollup.config.ts',
          '.eslintrc.cjs',
          '__tests__/**/*',
          '__mocks__/**/*',
        ],
      },
    ],
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',

    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-param-reassign': [
      'error',
      {
        ignorePropertyModificationsFor: ['state'],
        props: true,
      },
    ],
    'no-underscore-dangle': 0,
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
    'sort-keys-fix/sort-keys-fix': 'warn',

    'tsdoc/syntax': 'warn',
    'typescript-sort-keys/interface': 'warn',
    'typescript-sort-keys/string-enum': 'warn',
  },
  settings: {
    'import/core-modules': [],
    'import/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
    'import/order': [
      'error',
      {
        groups: [
          'index',
          'sibling',
          'parent',
          'internal',
          'external',
          'builtin',
          'object',
          'type',
        ],
      },
    ],
  },
  overrides: [
    {
      env: {
        jest: true,
        'jest/globals': true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: tsTestConfig.include,
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.test.json'], // Specify it only for TypeScript files
      },
      plugins: [
        '@typescript-eslint/eslint-plugin',
        'eslint-plugin-tsdoc',
        'jest',
      ],
    },
  ],
};
