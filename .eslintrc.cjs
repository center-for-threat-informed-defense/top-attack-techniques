/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2020
	},
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
    "@vue/typescript",
		"@vue/typescript/recommended",
    "@vue/prettier/@typescript-eslint"
  ]
}
