import globals from 'globals';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  // JavaScript 기본 설정
  js.configs.recommended,
  
  // JavaScript 파일 설정
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      // 기본 규칙
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      
      // 코드 품질 규칙
      'complexity': ['warn', 10],
      'max-lines-per-function': ['warn', 20],
      'max-depth': ['warn', 3]
    }
  },
  
  // TypeScript 파일 설정
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // 기본 규칙
      'no-var': 'error',
      'prefer-const': 'error',
      'no-global-assign': 'error',
      'no-unused-vars': 'off', // TypeScript 규칙 사용
      'no-console': 'warn',
      
      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // 코드 품질 규칙
      'complexity': ['warn', 10],
      'max-lines-per-function': ['warn', 20],
      'max-depth': ['warn', 3]
    }
  },
  
  // 특정 파일 제외
  {
    ignores: [
      'src/main.original.js',
      'dist/**',
      'node_modules/**',
      '**/*.test.js'
    ]
  },
  
  // Prettier와 충돌 방지
  prettierConfig
]; 