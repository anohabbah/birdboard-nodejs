require('dotenv').config();
require(__dirname + '/models');
const startupDebugger = require('debug')('app:startup');
const morgan = require('morgan');
const helmet = require('helmet');
const projectsRouter = require(__dirname + '/routes/projects');
const usersRouter = require(__dirname + '/routes/users');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('morgan enabled...');
}

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello, World !');
});

module.exports = app;
