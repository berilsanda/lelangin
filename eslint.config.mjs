import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', 'dist/', '.expo/', 'ios/', 'android/', 'coverage/'],
  },
  ...tseslint.configs.strict,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'check-file': checkFile,
      '@tanstack/query': tanstackQuery,
      prettier,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/ignore': ['node_modules'],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...tanstackQuery.configs['flat/recommended'][0]?.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/constants/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['UPPER_CASE', 'camelCase'],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.object.name="StyleSheet"][callee.property.name="create"] Literal[typeofValue="number"]',
          message:
            'Avoid inline numeric literals in StyleSheet.create(). Use tokens from src/constants/ instead.',
        },
      ],
    },
  },
);
