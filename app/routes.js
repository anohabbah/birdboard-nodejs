const express = require('express');
const helmet = require('helmet');
const error = require(__dirname + '/../middleware/error');

const projectsRouter = require(__dirname + '/../routes/projects');
const usersRouter = require(__dirname + '/../routes/users');

module.exports = function(db, app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  app.use('/api/users', usersRouter(db));
  app.use('/api/projects', projectsRouter(db));

  app.use(error);
};
