import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        alert: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        process: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        it: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      // 기본 규칙
      "no-unused-vars": "warn",
      "no-console": "off",

      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],

      // ES6+ 권장 규칙
      "prefer-const": "error",
      "no-var": "error",

      // 추가 규칙
      "no-empty": "warn",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",

      // 클린코드 관련 규칙 (현실적으로 조정)
      complexity: ["warn", 15],
      "max-depth": ["warn", 6],
      "max-lines": ["warn", 500],
      "max-params": ["warn", 6],

      // 변수 관련 규칙
      "no-redeclare": "error",
      "no-shadow": "warn",

      // 함수 관련 규칙
      "no-empty-function": "warn",
      "prefer-arrow-callback": "warn",

      // 객체 관련 규칙
      "object-shorthand": "warn",
      "prefer-destructuring": "warn",
    },
  },
  {
    // 설정 파일 자체에는 규칙 적용 안함
    files: ["eslint.config.js"],
    rules: {
      quotes: "off",
      semi: "off",
      indent: "off",
    },
  },
  {
    ignores: ["node_modules/", "dist/", "build/", "coverage/", "*.min.js"],
  },
];
