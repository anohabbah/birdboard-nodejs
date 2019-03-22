const Joi = require('joi');
const express = require('express');
const { Project } = require('../models');
const router = express.Router();
const authGuard = require('../middleware/auth');

/**
 * Validate request.
 * @param {Object} req
 * @return {*}
 */
function validate(req) {
  const rules = {
    title: Joi.string()
      .max(255)
      .required(),
    description: Joi.string().required()
  };

  return Joi.validate(req, rules);
}

router.get('/', authGuard, async (req, res) => {
  const projects = await Project.findAll();

  res.json(projects);
});

router.post('/', authGuard, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.create(req.body);

  res.status(201).json(project);
});

router.get('/:projectId', authGuard, async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByPk(projectId);
  if (!project) return res.status(404).send('Resource not found');

  res.status(200).json(project);
});

router.patch('/:projectId', authGuard, async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByPk(projectId);
  if (!project) return res.status(404).send('Resource not found');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description } = req.body;

  await project.update({ title, description });

  res.status(200).json(project);
});

router.delete('/:projectId', authGuard, async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByPk(projectId);
  if (!project) return res.status(404).send('Resource not found');

  await project.destroy();

  res.status(200).json(project);
});

module.exports = router;
