module.exports = {
    root: true,
    ignorePatterns: [
        '.eslintrc.js',
    ],
    plugins: [
        'jsdoc',
        'import',
        'prefer-arrow',
    ],
    overrides: [
        {
            files: [
                '*.js'
            ],
            env: {
                browser: true,
            },
            parserOptions: {
                ecmaVersion: 8,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            extends: [
                'eslint:recommended',
                'plugin:jsdoc/recommended',
            ],
            rules: {
                'no-magic-numbers': [
                    'error',
                    {
                        ignore: [0, 1, -1, 2, 100],
                    }
                ],
                'no-shadow': 'error',
                'brace-style': [
                    'error',
                    '1tbs'
                ],
                'comma-dangle': [
                    'error',
                    'always-multiline'
                ],
                'comma-spacing': 'error',
                'default-param-last': 'error',
                'dot-notation': 'error',
                'indent': ['error', 2],
                'keyword-spacing': 'error',
                'no-throw-literal': 'error',
                'no-unused-expressions': 'error',
                'quotes': ['error', 'single'],
                'no-return-await': 'error',
                'semi': 'error',
                'capitalized-comments': [
                    'error',
                    'always'
                ],
                'id-blacklist': 'off',
                'id-match': 'off',
                'import/no-deprecated': 'error',
                'import/order': 'error',
                'no-multiple-empty-lines': 'error',
                'no-underscore-dangle': 'off',
                'arrow-body-style': 'off',
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            'rxjs-compat/*',
                        ],
                    },
                ],
                // JSDoc override.
                'jsdoc/newline-after-description': 'off',
                'jsdoc/require-param': [
                    'error',
                    {
                        enableFixer: false,
                    }
                ],
                'jsdoc/require-example': 'off',
                'jsdoc/require-file-overview': 'off',
                'jsdoc/require-hyphen-before-param-description': 'off',
                'prefer-arrow/prefer-arrow-functions': [
                    'error',
                    {
                        disallowPrototype: true,
                        singleReturnOnly: false,
                        classPropertiesAllowed: false,
                        allowStandaloneDeclarations: true,
                    }
                ],
                'jsdoc/require-param-type': 'off',
                'jsdoc/require-returns': 'off',
                'jsdoc/require-property': 'off',
                'jsdoc/require-property-description': 'off',
                'jsdoc/require-returns-check': 'off',
                'jsdoc/require-returns-type': 'off',
                'jsdoc/check-access': 'off',
                'jsdoc/empty-tags': 'off',
            },
        },
    ],
};