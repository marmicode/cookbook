const baseConfig = require('../../eslint.config.js');
const nx = require('@nx/eslint-plugin');
const playwright = require('eslint-plugin-playwright');

console.log();

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    ignores: ['.docusaurus'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.ts'],
  },
];
