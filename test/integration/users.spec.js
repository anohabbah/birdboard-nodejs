const bcrypt = require('bcrypt');
const faker = require('faker');
const request = require('supertest');
const _ = require('lodash');
const { sequelize, User } = require('../../models');
const app = require('../../app');

describe('ProjectsTest', function() {
  let salt;
  let hashedPassword;
  const password = '123456789';
  let attributes;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('POST /api/users/register', () => {
    beforeEach(() => {
      attributes = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password
      };
    });

    const exec = async () => {
      return await request(app)
        .post('/api/users/register')
        .send(attributes);
    };

    it('should register a user', async function() {
      const res = await exec();

      const user = await User.findOne({ where: { email: attributes.email } });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining(_.pick(user, ['id', 'name', 'email']))
      );
    });

    it('should return 400 if name is missing', async function() {
      attributes = _.pick(attributes, ['email', 'password']);

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async function() {
      attributes = _.pick(attributes, ['email', 'name']);

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is missing', async function() {
      attributes = _.pick(attributes, ['name', 'password']);

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if the email is already used', async function() {
      await User.create(attributes);
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    let params;

    beforeEach(async () => {
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      attributes = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashedPassword
      };

      await User.create(attributes);

      params = { email: attributes.email, password };
    });

    const exec = async () => {
      return await request(app)
        .post('/api/users/login')
        .send(params);
    };

    it('should log in a user', async function() {
      const res = await exec();

      const user = await User.findOne({ where: { email: attributes.email } });

      expect(res.body).toEqual(
        expect.objectContaining(_.pick(user, ['id', 'name', 'email']))
      );
      expect(res.header['x-auth-token']).toEqual(user.token);
    });

    it('should require an email to authenticate users', async function() {
      params = _.pick(params, ['password']);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should require password to authenticate users', async function() {
      params = _.pick(params, ['email']);
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should fail if the email doesnt exist', async function() {
      params = { email: 'test@test.test', password };
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should fail if the password is incorrect', async function() {
      params = { email: attributes.email, password: 'dshb' };
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
