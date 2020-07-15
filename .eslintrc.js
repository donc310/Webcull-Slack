module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none',
      },
    ],
    'array-bracket-spacing': [2, 'never'],
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': [2, 'always'],
    'brace-style': [2, '1tbs'],
    camelcase: [
      0,
      {
        properties: 'always',
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': [2, 'last'],
    curly: [2, 'all'],
    'dot-location': [2, 'property'],
  },
};
