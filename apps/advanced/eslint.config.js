import { globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

import rootConfig from "../../eslint.config.js";

export default tseslint.config([
	globalIgnores(["dist"]),
	rootConfig,
	{
		files: ["**/*.{ts,tsx}"],
		extends: [reactHooks.configs["recommended-latest"], reactRefresh.configs.vite]
	},
	{
		languageOptions: {
			parserOptions: {
				ecmaFeatures: { jsx: true }
			}
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true
				}
			]
		}
	}
]);
