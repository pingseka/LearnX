import globals from 'globals';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginNext from '@next/eslint-plugin-next';

export default [
  {
    ignores: ['node_modules/', '.next/', 'coverage/', 'dist/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: parserTs,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    plugins: {
      '@typescript-eslint': pluginTs,
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'warn',
    },
  },
];
