/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: ['plugin:vue/vue3-essential', '@vue/eslint-config-typescript', 'plugin:prettier/recommended'],
	overrides: [
		{
			files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
			extends: ['plugin:cypress/recommended'],
		},
	],
	env: {
		browser: true,
		es6: true,
		node: true,
		commonjs: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
	ignorePatterns: ['node_modules/*', 'dist/*', '!.prettierrc.js'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				semi: false,
			},
		],
		'no-var': 'error',
		'no-unused-vars': 'error',
		eqeqeq: ['error', 'always'],
		'no-console': 'error',
		'no-debugger': 'error',
		'no-alert': 'error',
		'no-else-return': 'error',
		'no-eval': 'error',
		semi: ['error', 'never'],
	},
}
