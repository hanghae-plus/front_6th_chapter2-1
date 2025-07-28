import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".cache/**",
      ".vite/**",
      "coverage/**",
      "pnpm-lock.yaml",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        window: "readonly",
        alert: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        Math: "readonly",
        Date: "readonly",
        parseInt: "readonly",
        location: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Prettier 규칙
      "prettier/prettier": "error",

      // 변수 관련 (일부 완화)
      "no-var": "warn",
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "no-redeclare": "warn",

      // 함수 관련
      "prefer-arrow-callback": "warn",

      // 코드 품질
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "no-alert": "warn",
      "no-empty": "warn",

      // 코딩 스타일
      "consistent-return": "error",
      curly: ["error", "all"],
      "no-else-return": "warn",

      // 복잡도 제한 (완화)
      "max-len": [
        "warn",
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "max-lines-per-function": ["warn", { max: 100 }],
      complexity: ["warn", { max: 15 }],
    },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "max-lines-per-function": "off",
    },
  },
];
