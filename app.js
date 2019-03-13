require('dotenv').config();
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('morgan enabled...');
}
dbDebugger();

app.get('/', (req, res) => {
  res.status(200).send('Hello, World !');
});

module.exports = app;
