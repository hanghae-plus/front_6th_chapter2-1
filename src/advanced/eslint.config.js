import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      pluginReact.configs.flat.recommended,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      js,
      react: pluginReact,
      prettier,
    },
    rules: {
      'no-console': 'warn',
      'react/prop-types': 'off',
      'prettier/prettier': 'error',
    },
  },
]);
