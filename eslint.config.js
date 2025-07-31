import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
    },
    rules: {
      // Prettier 통합
      'prettier/prettier': 'error',

      // 함수형 프로그래밍 관련 룰
      'no-var': 'error',
      'prefer-const': 'error',
      'no-let': 'off', // let은 때로 필요하므로 off
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-param-reassign': 'error', // 매개변수 변경 방지
      'no-mutation': 'off', // 커스텀 룰이므로 off

      // 일반적인 코드 품질 룰
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'consistent-return': 'error',

      // 함수 관련
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'no-useless-concat': 'error',

      // ES6+ 문법 강제
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
      ],

      // 코드 스타일
      'comma-dangle': ['error', 'always-multiline'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        parseInt: 'readonly',
        Math: 'readonly',
        Date: 'readonly',
      },
    },
  },
];
