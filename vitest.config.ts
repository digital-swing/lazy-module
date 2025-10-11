/// <reference types="vitest" />

import { configDefaults, defineConfig } from 'vitest/config';
import GithubActionsReporter from 'vitest-github-actions-reporter';

export default defineConfig({
  test: {
    clearMocks: true,
    include: ['src/**/*.test.{ts,js}'],

    coverage: {
      enabled: true,
      reporter: [
        ['lcov', { projectRoot: './src' }],
        ['json', { file: 'coverage.json' }],
        'json-summary',
        ['text'],
      ],
      include: ['src/**'],
    },

    environment: 'jsdom',

    exclude: [...configDefaults.exclude, '.history'],
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    reporters: process.env.GITHUB_ACTIONS
      ? ['default', new GithubActionsReporter()]
      : 'default',
    setupFiles: 'test-setup.ts',
  },
});
