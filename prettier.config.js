/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	tabWidth: 2,
	printWidth: 120,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'none',
	bracketSpacing: true,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	plugins: ['prettier-plugin-tailwindcss']
}
