const tsConfig = require('./tsconfig.json');
const tsTestConfig = require('./tsconfig.test.json');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: './.babelrc.cjs',
    },
    ecmaFeatures: {
      globalReturn: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.cjs'],
  },
  plugins: ['import', 'prettier'],
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
    es6: true,
    amd: true,
    browser: true,
    jquery: true,
  },
  overrides: [
    {
      parser: '@typescript-eslint/parser',
      files: tsConfig.include, // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
    },

    {
      parser: '@typescript-eslint/parser',
      files: tsTestConfig.include, // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.test.json'], // Specify it only for TypeScript files
      },
      env: {
        jest: true,
        'jest/globals': true,
      },
      plugins: ['jest'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
    },
  ],
  settings: {
    'import/core-modules': [],
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
    'import/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
  },
  ignorePatterns: [
    '**/node_modules/*.[tj]s',
    '**/vendor/*.[tj]s',
    '**/dist/**/*.[tj]s',
    '**/public/**/*.[tj]s',
    '**/build/**/*.[tj]s',
  ].concat(tsConfig.exclude),
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': 0,
    // 'no-undef': 'warn',
    'func-names': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'webpack.config.cjs',
          'webpack.prod.cjs',
          'webpack.dev.cjs',
          'rollup.config.ts',
          'setupTestFrameworkScriptFile.ts',
          '.eslintrc.cjs',
          '__tests__/**/*',
          '__mocks__/**/*',
        ],
      },
    ],

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
  },
};
