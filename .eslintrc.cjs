module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base'
  ],
  parserOptions: {
    project: [
      'tsconfig.json',
    ]
  },
  env: {
    'node': true,
  },
  ignorePatterns: [
    '.eslintrc.cjs'
  ]
};