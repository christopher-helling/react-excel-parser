module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', 'src/'],
            },
        },
    },
    parserOptions: { ecmaVersion: 8, sourceType: 'module' },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
    ],
    rules: {
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'], // allow windows linebreaks (CRLF)
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'max-len': ['error', 175],
    },
    ignorePatterns: ['node_modules/*', 'src/__deprecated/*', 'dist/*'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb',
    ],
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            parser: '@typescript-eslint/parser',
            settings: {
                react: { version: 'detect' },
                'import/resolver': {
                    typescript: {},
                },
            },
            env: {
                browser: true,
                node: true,
                es6: true,
            },
            extends: [
                'eslint:recommended',
                'plugin:import/errors',
                'plugin:import/warnings',
                'plugin:import/typescript',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            rules: {
                'import/order': [
                    'error',
                    {
                        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
                        'newlines-between': 'never',
                        alphabetize: { caseInsensitive: true },
                    },
                ],
                'import/default': 'off',
                'import/no-named-as-default-member': 'off',
                'import/no-named-as-default': 'off',
                'react/require-default-props': 'off',
                'jsx-a11y/control-has-associated-label': 'off',
                'jsx-a11y/anchor-is-valid': 'off',
                'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
                'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
                'react/react-in-jsx-scope': 'off',
                '@typescript-eslint/no-unused-vars': ['off'],
                '@typescript-eslint/explicit-function-return-type': ['off'],
                '@typescript-eslint/explicit-module-boundary-types': ['off'],
                '@typescript-eslint/no-empty-function': ['off'],
                '@typescript-eslint/no-explicit-any': ['off'],
                '@typescript-eslint/ban-types': ['off'],
                'import/export': 0,
                'no-shadow': 'off',
                '@typescript-eslint/no-shadow': ['error'],
            },
        },
    ],
};
