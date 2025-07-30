import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

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
      import: importPlugin,
    },
    rules: {
      // Prettier 규칙
      "prettier/prettier": "error",

      // Airbnb 기반 변수 및 함수 규칙
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],
      "no-redeclare": "error",
      "no-shadow": "error",
      "no-undef": "error",

      // 함수 관련 (Airbnb 스타일)
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "arrow-body-style": ["error", "as-needed"],
      "arrow-parens": ["error", "as-needed"],
      "arrow-spacing": ["error", { before: true, after: true }],

      // 코드 품질 (Airbnb 기준)
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": "warn",
      "no-alert": "error",
      "no-debugger": "error",
      "no-empty": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // 객체 및 배열 (Airbnb 스타일)
      "object-shorthand": ["error", "always"],
      "prefer-destructuring": [
        "error",
        {
          array: true,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      "quote-props": ["error", "as-needed"],
      "no-array-constructor": "error",
      "no-new-object": "error",

      // 문자열 (Airbnb 스타일)
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "no-useless-concat": "error",

      // 조건문 및 루프
      curly: ["error", "all"],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-unneeded-ternary": ["error", { defaultAssignment: false }],
      "no-nested-ternary": "error",

      // 공백 및 스타일 (Prettier와 충돌하지 않는 것들)
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      // Import/Export 관련
      "import/no-unresolved": "off", // 프로젝트 특성상 비활성화
      "import/prefer-default-export": "off",
      "import/no-default-export": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // 복잡도 제한 (리팩토링 프로젝트에 맞게 완화)
      "max-len": [
        "warn",
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
      "max-lines-per-function": ["warn", { max: 80 }],
      complexity: ["warn", { max: 12 }],
      "max-depth": ["warn", { max: 4 }],
      "max-params": ["warn", { max: 4 }],

      // 기타 품질 규칙
      "consistent-return": "error",
      "default-case": "error",
      "no-case-declarations": "error",
      "no-fallthrough": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-return-assign": ["error", "always"],
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      "no-useless-call": "error",
      "no-useless-return": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
      radix: "error",
      yoda: "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
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
      import: importPlugin,
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Prettier 규칙
      "prettier/prettier": "error",

      // TypeScript 관련
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],

      // Import/Export 관련 - 내부/외부 라이브러리 분리 및 알파벳 순 정렬
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
      "import/no-default-export": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "react-*",
              group: "external",
              position: "after",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/lib/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/components/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/store/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/types/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/data/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/utils/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // 기타 규칙들
      "no-var": "error",
      "prefer-const": "error",
      "no-redeclare": "error",
      "no-shadow": "error",
      "no-undef": "error",
      "no-console": "warn",
      "no-alert": "error",
      "no-debugger": "error",
      "no-empty": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "no-useless-concat": "error",
      curly: ["error", "all"],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-unneeded-ternary": ["error", { defaultAssignment: false }],
      "no-nested-ternary": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],
      "max-len": [
        "warn",
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
      "max-lines-per-function": ["warn", { max: 80 }],
      complexity: ["warn", { max: 12 }],
      "max-depth": ["warn", { max: 4 }],
      "max-params": ["warn", { max: 4 }],
      "consistent-return": "error",
      "default-case": "error",
      "no-case-declarations": "error",
      "no-fallthrough": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-return-assign": ["error", "always"],
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unused-expressions": [
        "error",
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      "no-useless-call": "error",
      "no-useless-return": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
      radix: "error",
      yoda: "error",
    },
  },
  {
    files: ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx"],
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
      "prefer-arrow-callback": "off",
      "func-style": "off",
    },
  },
];
