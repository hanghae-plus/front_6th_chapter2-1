import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['**/main.original.js']),
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js, '@stylistic': stylistic },
    rules: {
      '@stylistic/quotes': ['error', 'single'],
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
]);
