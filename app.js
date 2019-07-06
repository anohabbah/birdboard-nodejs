require('express-async-errors');
require('dotenv').config();
const db = require(__dirname + '/models'); // start db
const startupDebugger = require('debug')('app:startup');
const morgan = require('morgan');

const express = require('express');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('morgan enabled...');
}

require('./app/logging');
require('./app/config')();
require('./app/routes')(db, app);

module.exports = app;
