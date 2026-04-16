// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/** Порядок групп импортов под алиасы из `tsconfig.app.json` (`@api`, `@app`, `@modules`, …). */
const simpleImportSortImportGroups = [
  // Side effect imports.
  ['^\\u0000'],
  // Node.js builtins (`node:sqlite`, …).
  ['^node:'],
  // Packages: `react` / `react-dom` first, затем остальные npm-пакеты (`styled-components`, `@mediapipe/...`, …).
  ['^react', '^@?\\w'],
  // Внутренние алиасы проекта (корни под `src/`).
  ['^@(api|app|components|contexts|modules|pages|routes|test-helpers|theme|types|utils)(/|$)'],
  // Parent imports. Put `..` last.
  ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
  // Other relative imports. Put same-folder `.` last.
  ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
  // Style imports.
  ['^.+\\.s?css$'],
]

export default defineConfig([globalIgnores(['dist', 'server/dist', 'coverage', 'storybook-static']), {
  files: ['**/*.{ts,tsx}'],
  ignores: ['server/**'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    eslintPluginPrettierRecommended,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    curly: ['error', 'all'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: simpleImportSortImportGroups,
      },
    ],
    'simple-import-sort/exports': 'error',
  },
}, {
  files: ['server/**/*.ts'],
  extends: [js.configs.recommended, tseslint.configs.recommended],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.nodeBuiltin,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    curly: ['error', 'all'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: simpleImportSortImportGroups,
      },
    ],
    'simple-import-sort/exports': 'error',
  },
}, {
  files: ['src/pages/*/index.tsx'],
  rules: {
    'react-refresh/only-export-components': [
      'error',
      {
        allowConstantExport: true,
        allowExportNames: ['routes'],
      },
    ],
  },
}, ...storybook.configs["flat/recommended"]])
