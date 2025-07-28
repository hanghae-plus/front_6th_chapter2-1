import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  
  // Airbnb base 설정을 flat config로 변환
  ...compat.extends("airbnb-base"),
  
  // Prettier 설정
  eslintPluginPrettier,
  eslintConfigPrettier,
  
  // 프로젝트별 커스텀 규칙
  {
    rules: {
      // 콘솔 관련
      "no-console": "warn",
      
      // 변수 관련
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "no-var": "error",
      "prefer-const": "error",
      
      // Import 관련
      "import/no-extraneous-dependencies": ["error", {
        "devDependencies": [
          "**/*.test.js", 
          "**/*.spec.js", 
          "vite.config.js", 
          "eslint.config.js"
        ]
      }],
    }
  }
]; 