module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['simple-import-sort'],
  rules: {},
  ignorePatterns: ['node_modules'],
  parserOptions: {
    parser: {
      ts: '@typescript-eslint/parser',
      js: '@typescript-eslint/parser',
    },
  },
  globals: {
    T: 'readonly', // naming convention used to define the type on generic Vue components
  },
}
