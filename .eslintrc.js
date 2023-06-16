module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		parser: '@babel/eslint-parser'
	},
	rules: {
		// "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		// "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		'vue/valid-v-slot': [
			'warn',
			{
				allowModifiers: true
			}
		],
		'vue/attributes-order': [
			'warn',
			{
				order: [
					'DEFINITION',
					['UNIQUE', 'SLOT'],
					'LIST_RENDERING',
					'CONDITIONALS',
					'RENDER_MODIFIERS',
					'TWO_WAY_BINDING',
					'OTHER_DIRECTIVES',
					'OTHER_ATTR',
					'GLOBAL',
					'EVENTS',
					'CONTENT'
				],
				alphabetical: false
			}
		],
		'vue/max-attributes-per-line': [
			'warn',
			{
				singleline: {
					max: 1
				},
				multiline: {
					max: 1
				}
			}
		],
		'vue/first-attribute-linebreak': [
			'warn',
			{
				singleline: 'ignore',
				multiline: 'below'
			}
		],
		'vue/html-self-closing': [
			'warn',
			{
				html: {
					void: 'never',
					normal: 'always',
					component: 'always'
				},
				svg: 'always',
				math: 'always'
			}
		],
		'vue/html-indent': [
			'warn',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: []
			}
		],
		'vue/component-name-in-template-casing': [
			'warn',
			'PascalCase',
			{
				registeredComponentsOnly: true
			}
		],
		'vue/no-irregular-whitespace': [
			'warn',
			{
				skipStrings: true,
				skipComments: false,
				skipRegExps: false,
				skipTemplates: false,
				skipHTMLAttributeValues: false,
				skipHTMLTextContents: false
			}
		],
		'vue/html-closing-bracket-newline': [
			'error',
			{
				singleline: 'never',
				multiline: 'always'
			}
		],
		'vue/multiline-html-element-content-newline': [
			'warn',
			{
				ignoreWhenEmpty: true,
				ignores: [],
				allowEmptyLines: false
			}
		],
		'vue/component-definition-name-casing': ['warn', 'PascalCase'],
		'vue/match-component-file-name': [
			'warn',
			{
				extensions: ['vue'],
				shouldMatchCase: false
			}
		],
		'vue/no-dupe-keys': [
			'warn',
			{
				groups: []
			}
		],
		'vue/order-in-components': [
			'warn',
			{
				order: [
					'name',
					['components', 'directives', 'filters'],
					['provide', 'inject'],
					'extends',
					'mixins',
					'emits',
					['props', 'propsData'],
					'setup',
					'data',
					'computed',
					'watch',
					'LIFECYCLE_HOOKS',
					'methods'
				]
			}
		],
		'comma-dangle': [
			'warn',
			{
				arrays: 'never',
				objects: 'never',
				imports: 'never',
				exports: 'never',
				functions: 'never'
			}
		],
		'no-console': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-plusplus': 'off',
		'constructor-super': 'off',
		'no-mixed-operators': [
			'warn',
			{
				groups: [
					['+', '-', '*', '/', '%', '**'],
					['&', '|', '^', '~', '<<', '>>', '>>>'],
					['==', '!=', '===', '!==', '>', '>=', '<', '<='],
					['&&', '||'],
					['in', 'instanceof']
				],
				allowSamePrecedence: true
			}
		],
		'import/extensions': 'off',
		'import/prefer-default-export': 'off',
		'no-unused-expressions': 'warn',
		'no-param-reassign': 'off',
		'prefer-destructuring': 'off',
		'no-bitwise': ['error', { allow: ['~'] }],
		'max-len': ['warn', { ignoreStrings: true, code: 180, comments: 400 }],
		'object-curly-newline': [
			'warn',
			{
				ObjectExpression: { multiline: true, consistent: true },
				ObjectPattern: { multiline: true, consistent: true }
			}
		],
		quotes: ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
		'vue/no-mutating-props': 'off',
    'vue/no-multiple-template-root': 'off',
		'no-prototype-builtins': 'off',
		'vue/multi-word-component-names': 'off',
		semi: ['warn', 'never'],
		// "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
		'space-before-function-paren': [
			'warn',
			{
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'arrow-spacing': ['warn', { before: true, after: true }],
		'object-curly-spacing': ['warn', 'always'],

		// PRETTIER PLUGIN RULE
		'prettier/prettier': ['off', { spaceBeforeFunctionParen: false }] // resolve space conflict (need check!!!)
	}
}
