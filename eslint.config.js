import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier'; // ESLint와 Prettier 규칙 충돌 방지
import prettier from 'eslint-plugin-prettier'; // Prettier 포맷팅을 ESLint 규칙으로 적용
import simpleImportSort from 'eslint-plugin-simple-import-sort'; // import/export 문 자동 정렬
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['src/main.original.js', '**/__tests__']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
    },
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
    },
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      'prettier/prettier': 'error',

      'simple-import-sort/imports': 'error', // import 문을 알파벳순으로 정렬 (가독성 향상)
      'simple-import-sort/exports': 'error', // export 문을 알파벳순으로 정렬

      'no-console': 'warn', // console.log 사용 경고 (운영환경 배포시 제거 필요)
      'no-var': 'error', // var 사용 금지 (let/const 사용 강제)
      'prefer-const': 'error', // 재할당 없는 변수는 const 사용 강제
      eqeqeq: ['error', 'always'],

      ...prettierConfig.rules,
    },
  },
]);
