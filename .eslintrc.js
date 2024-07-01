import globals from 'globals';
import pluginJs from '@eslint/js';

export default {
  extends: ['plugin:@eslint/eslint-recommended', 'plugin:@eslint/recommended'],
  plugins: {
    js: pluginJs,
  },
  files: ['.eslintrc.{js,cjs}'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    ...globals,
    $: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-undef': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    'no-console': 'warn',
    'no-unused-vars': ['warn', { args: 'none' }],
  },
};
