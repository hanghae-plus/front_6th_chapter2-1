import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      // 기본 규칙들
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': 'error',
      'no-else-return': 'error',
      'no-param-reassign': 'error',

      // 최신 문법 권장 규칙들
      'prefer-const': 'error', // 재할당하지 않는 변수 const 사용
      'object-shorthand': 'error', // 객체 리터럴 속성 단축 구문 사용
      'prefer-template': 'error', // 템플릿 리터럴 사용
      'prefer-destructuring': 'error', // 구조 분해 할당 사용
    },
  },
  pluginReact.configs.flat.recommended,
]);