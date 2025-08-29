// Minimal ESLint flat config for ESLint v9
// Intentionally minimal to "keep current rules" while enabling guards.
// Lints only project source files and fails on warnings via CLI flag.

import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Keep rules minimal for Phase 0; guard enforced by --max-warnings=0
    },
  },
];

