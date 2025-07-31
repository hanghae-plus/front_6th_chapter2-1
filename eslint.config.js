import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";

const globalConfig = {
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: "module",
		globals: {
			...globals.browser,
			...globals.node,
			...globals.es2024
		}
	},
	rules: {
		// 코드 품질
		"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"no-console": "warn",
		"no-debugger": "error",
		"no-alert": "warn",

		// 모던 JavaScript
		"prefer-const": "error",
		"no-var": "error",
		"prefer-arrow-functions": "off",
		"prefer-template": "error",

		// 코드 스타일
		curly: ["error", "all"],
		eqeqeq: ["error", "always"],
		"no-eval": "error",
		"no-implied-eval": "error",

		// 함수 관련
		"no-duplicate-imports": "error",
		"no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],

		// React 전환 대비
		"no-direct-mutation-state": "off",
		"consistent-return": "warn"
	}
};

const testFileConfig = {
	files: ["**/*.test.js", "**/__tests__/**/*.js"],
	plugins: {
		vitest: vitestPlugin
	},
	rules: {
		...vitestPlugin.configs.recommended.rules,
		"no-console": "off"
	},
	languageOptions: {
		globals: {
			...vitestPlugin.environments.env.globals
		}
	}
};

const importSortConfig = {
	plugins: {
		"simple-import-sort": simpleImportSort
	},
	rules: {
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error"
	}
};

const ignoresConfig = {
	ignores: [
		"**/node_modules/**",
		"**/dist/**",
		"**/build/**",
		"**/.vite/**",
		"**/coverage/**",
		"apps/original/**",
		"**/*.html"
	]
};

export default [
	ignoresConfig,
	js.configs.recommended,
	globalConfig,
	testFileConfig,
	importSortConfig,
	prettierConfig
];
