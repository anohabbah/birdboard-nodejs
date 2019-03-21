const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require(__dirname + '/../models');

/**
 *
 * @param {Object} request
 * @return {*}
 */
function validate(request) {
  const rules = {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };

  return Joi.validate(request, rules);
}

/**
 *
 * @param {Object} req
 * @return {*}
 */
function validateAuthRequest(req) {
  const rules = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };

  return Joi.validate(req, rules);
}

router.post('/register', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send('Email already exists.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user = await User.create(
    _.assign({ password: hashedPassword }, _.pick(req.body, ['name', 'email']))
  );

  res.json(_.pick(user, ['id', 'name', 'email']));
});

router.post('/login', async (req, res) => {
  const { error } = validateAuthRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.status(400).send('Email or password invalid.');

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send('Email or password invalid.');

  res
    .header('x-auth-token', user.token)
    .json(_.pick(user, ['id', 'name', 'email']));
});

module.exports = router;
