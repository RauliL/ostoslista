import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

const srcFiles = ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'];
const reactFiles = ['src/**/*.{jsx,tsx}'];

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  {
    files: srcFiles,
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: srcFiles,
  })),
  {
    files: reactFiles,
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
