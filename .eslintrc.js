module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'node': true,
    'jest': true,
    'es6': true,
  },
  'extends': ['google', 'prettier'],
  'plugins': ['prettier'],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        arrowParens: 'always',
        endOfLine: 'crlf'
      },
    ],
    'new-cap': ['error', {capIsNew: false}]
  },
};
