import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    },
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      import: importPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'import/default': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          groups: ['external', 'index', 'sibling', 'parent', 'internal', 'builtin', 'object', 'type', ],
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            caseInsensitive: true /* ignore case. Options: [true, false] */
          }
        }
      ],
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5'
        }
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      // indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never'
        }
      ],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off'
    }
  }
);
