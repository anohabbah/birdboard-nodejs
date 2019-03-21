const bcrypt = require('bcrypt');
const request = require('supertest');
const _ = require('lodash');
const { sequelize, User } = require('../models');
const app = require('../app');

let salt;
let hashedPassword;
const password = '123456789';

describe('ProjectsTest', function() {
  beforeEach(async () => {
    salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash('123456789', salt);
    await sequelize.sync({ force: true });
  });

  it('should register a user', async function() {
    const body = {
      name: 'John Doe',
      email: 'john@doe.test',
      password: '1234567'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(body);

    const user = await User.findOne({ where: { email: body.email } });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining(_.pick(user, ['id', 'name', 'email']))
    );
  });

  it('should return 400 if name is missing', async function() {
    const body = {
      email: 'john@doe.test',
      password: '1234567'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should return 400 if password is missing', async function() {
    const body = {
      name: 'John Doe',
      email: 'john@doe.test'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should return 400 if email is missing', async function() {
    const body = {
      name: 'John Doe',
      password: '1234567'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should return 400 if the email is already used', async function() {
    const body = {
      name: 'John Doe',
      email: 'john@doe.test',
      password: '1234567'
    };

    await User.create(body);
    const res = await request(app)
      .post('/api/users/register')
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should log in a user', async function() {
    const body = {
      name: 'John Doe',
      email: 'john@doe.test',
      password: hashedPassword
    };
    await User.create(body);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: body.email, password });

    const user = await User.findOne({ where: { email: body.email } });

    expect(res.body).toEqual(
      expect.objectContaining(_.pick(user, ['id', 'name', 'email']))
    );
    expect(res.header['x-auth-token']).toEqual(user.token);
  });

  it('should require an email to authenticate users', async function() {
    const res = await request(app)
      .post('/api/users/login')
      .send({ password });

    expect(res.status).toBe(400);
  });

  it('should require password to authenticate users', async function() {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
  });

  it('should fail if the email doesnt exist', async function() {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
  });

  it('should fail if the password is incorrect', async function() {
    const body = {
      name: 'John Doe',
      email: 'john@doe.test',
      password: hashedPassword
    };
    await User.create(body);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: body.email, password: '&é"' });

    expect(res.status).toBe(400);
  });
});
