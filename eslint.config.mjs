import js from '@eslint/js'
import globals from 'globals'
import pluginHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': pluginHooks,
      'react-refresh': reactRefresh,
      react: pluginReact,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginPrettierRecommended,
      importPlugin.flatConfigs.react,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
)
