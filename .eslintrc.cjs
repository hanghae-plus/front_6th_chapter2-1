module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['**/*.css', '**/__constants__/**', '**/__modules__/**'],
  overrides: [
    {
      // React + TypeScript 파일용 설정
      files: ['src/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['react', '@typescript-eslint', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:prettier/recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/function-component-definition': 'off',
        'react/require-default-props': 'off',
        'react/button-has-type': 'off',
        'react/no-unescaped-entities': 'off',
        'react/no-array-index-key': 'warn',
        'react/jsx-no-constructed-context-values': 'warn',
        'no-alert': 'off',
        'no-console': 'off',
        'default-case': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-shadow': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      // 바닐라 JavaScript 파일용 설정
      files: ['src/basic/**/*.js'],
      env: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        // 기본 JavaScript 규칙
        'no-var': 'off', // var 허용
        'vars-on-top': 'off', // var 선언 위치 제한 해제
        'no-unused-vars': 'warn', // 사용하지 않는 변수는 경고만
        'no-undef': 'error', // 정의되지 않은 변수 사용 금지
        'no-console': 'off', // console 사용 허용
        'func-names': 'off', // 익명 함수 허용
        'prefer-template': 'off', // 문자열 연결 연산자 허용
        'prefer-arrow-callback': 'off', // function 키워드 허용
        'prefer-destructuring': 'off', // 구조 분해 할당 강제하지 않음
        'prefer-const': 'off', // let 사용 허용
        'no-plusplus': 'off', // ++ 연산자 허용
        'no-param-reassign': 'off', // 파라미터 재할당 허용
        'no-use-before-define': ['error', { functions: false }], // 함수 호이스팅 허용

        // DOM 관련 규칙
        'no-alert': 'off', // alert 허용

        // 스타일 관련 규칙
        indent: ['error', 2], // 들여쓰기 2칸
        quotes: ['error', 'single'], // 작은따옴표 사용
        semi: ['error', 'always'], // 세미콜론 필수
      },
    },
  ],
};
