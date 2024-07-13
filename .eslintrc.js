module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.gen/**', 'node_modules/**', '.eslintrc.js', 'setup.js'],
  rules: {
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'no-restricted-syntax': 'off',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
};
