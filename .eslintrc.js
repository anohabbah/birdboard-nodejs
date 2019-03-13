module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
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
        endOfLine: 'lf'
      },
    ],
    'new-cap': ['error', {capIsNew: false}]
  },
};
