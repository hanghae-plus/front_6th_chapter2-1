module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  // React 사용 시 아래 주석 해제
  // extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    // React 사용 시 아래 주석 해제
    // ecmaFeatures: {
    //   jsx: true,
    // },
  },
  globals: {
    module: 'readonly',
  },
  // React 사용 시 아래 주석 해제
  // plugins: ['react'],
  rules: {
    // 여기에 custom 규칙 추가
  },
};
