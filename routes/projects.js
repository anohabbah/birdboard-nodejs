const Joi = require('joi');
const express = require('express');
const { Project } = require('../models');
const router = express.Router();

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

router.get('/', async (req, res) => {
  const projects = await Project.findAll();

  res.json(projects);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const project = await Project.create(req.body);

  res.status(201).json(project);
});

router.get('/:project', (req, res) => {});

router.patch('/:project', (req, res) => {});

router.delete('/:project', (req, res) => {});

module.exports = router;
