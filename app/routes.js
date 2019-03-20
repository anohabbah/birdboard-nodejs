const express = require('express');
const helmet = require('helmet');
const error = require(__dirname + '/../middleware/error');

const projectsRouter = require(__dirname + '/../routes/projects');
const usersRouter = require(__dirname + '/../routes/users');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  app.use('/api/users', usersRouter);
  app.use('/api/projects', projectsRouter);

  app.use(error);
};
