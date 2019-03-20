// const Joi = require('joi');
const express = require('express');
const { Project } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.findAll();

  res.json(projects);
});

router.post('/', async (req, res) => {
  const project = await Project.create(req.body);

  res.status(201).json(project);
});

router.get('/:project', (req, res) => {});

router.patch('/:project', (req, res) => {});

router.delete('/:project', (req, res) => {});

module.exports = router;
