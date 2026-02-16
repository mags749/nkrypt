const tsPlugin     = require('@typescript-eslint/eslint-plugin');
const tsParser     = require('@typescript-eslint/parser');
const reactPlugin  = require('eslint-plugin-react');
const hooksPlugin  = require('eslint-plugin-react-hooks');
const rnPlugin     = require('eslint-plugin-react-native');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'src/infra/database/migrations/**',
      'babel.config.js',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react:         reactPlugin,
      'react-hooks': hooksPlugin,
      'react-native': rnPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ── React ────────────────────────────────────────────────────────
      'react/react-in-jsx-scope': 'off',           // not needed in React 17+
      'react/prop-types': 'off',                    // using TypeScript
      'react/self-closing-comp': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // ── React Hooks ──────────────────────────────────────────────────
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── Coding standards: const arrow components ─────────────────────
      // Disallow `function` declaration components — enforce arrow style
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'ExportDefaultDeclaration > FunctionDeclaration',
          message:
            'Use arrow function components: const Foo = () => { ... }; export default Foo;',
        },
        {
          selector:
            'ExportNamedDeclaration > FunctionDeclaration[id.name=/^[A-Z]/]',
          message:
            'Use arrow function components: export const Foo = () => { ... };',
        },
      ],

      // ── General quality ──────────────────────────────────────────────
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-duplicate-imports': 'error',

      // ── React Native ─────────────────────────────────────────────────
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/split-platform-components': 'warn',
    },
  },
];
