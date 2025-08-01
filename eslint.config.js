import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 2021, // ECMAScript 문법 버전 지정
      sourceType: 'module', // ESM 기반
      globals: globals.browser, // 브라우저 환경의 전역 변수 사용
      parserOptions: {
        // JSX 문법을 ESLint가 파싱할 수 있게 설정
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      js, // JavaScript 전용 ESLint 규칙을 사용할 수 있도록 플러그인 설정
      react: pluginReact, // React 전용 ESLint 규칙을 사용할 수 있도록 플러그인 설정
    },
    rules: {
      'no-console': 'warn',
      'react/prop-types': 'off', // PropTypes 검사를 완전히 꺼서 props 타입을 정의하지 않아도 ESLint 에러/경고가 발생하지 않음.
    },
  },
  js.configs.recommended, // eslint:recommended 규칙 세트를 포함
  pluginReact.configs.flat.recommended,
]);
