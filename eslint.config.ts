import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsLint from 'typescript-eslint';
import * as importPlugin from 'eslint-plugin-import';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettier from 'eslint-plugin-prettier';
import { fixupPluginRules } from '@eslint/compat';
import path from "node:path";
import jest from 'eslint-plugin-jest';
import js from '@eslint/js';

import { FlatCompat } from '@eslint/eslintrc';
const __dirname = import.meta.dirname;

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});


  import tsConfig from './tsconfig.json' with { type: 'json' };
  import tsTestConfig from './tsconfig.test.json' with { type: 'json' };
const config: any = tsLint.config(
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.amd,
        ...globals.browser,
        ...globals.node,
      },

      parser: tsLint.parser,

      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },

    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ),

    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslintEslintPlugin,
      tsdoc,
      'simple-import-sort': simpleImportSort,
    },

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

      'func-names': 0,

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '*.config.cjs',
            '*.config.ts',
            '__tests__/**/*',
            '__mocks__/**/*',
          ],
        },
      ],

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

      'tsdoc/syntax': 'warn',
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
  },
  globalIgnores([
    '**/node_modules/*.[tj]s',
    '**/vendor/*.[tj]s',
    '**/dist/**/*.[tj]s',
    '**/public/**/*.[tj]s',
    '**/build/**/*.[tj]s',
    '**/coverage',
    '**/.history',
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.jest,
        ...jest.environments.globals.globals,
      },

      parser: tsLint.parser,

      parserOptions: {
        project: ['./tsconfig.test.json'],
      },
    },
    files: tsTestConfig.include,
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ),

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      tsdoc,
      jest,
    },
  }
);
export default config;
