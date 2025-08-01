import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // 무시할 파일들 지정
  {
    ignores: ['src/main.original.js'],
  },

  // 기본 JavaScript 권장 규칙
  js.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 코드 품질 규칙
      'no-unused-vars': 'error',
      'no-console': 'warn',
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      curly: 'error',
      'no-shadow': 'error',

      // 코드 스타일 규칙
      'max-len': ['error', { code: 120 }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      camelcase: 'error',

      // Prettier 통합
      'prettier/prettier': 'error',
    },
  },

  // Prettier와 충돌하는 규칙 비활성화
  prettier,
];
