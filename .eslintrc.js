module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native-community',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    indent: 'off', // conflicts with prettier
    quotes: 'off', // conflicts with prettier
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
    'linebreak-style': ['error', 'unix'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['coverage/*'],
};
