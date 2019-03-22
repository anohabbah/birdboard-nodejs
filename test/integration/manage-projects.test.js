const Faker = require('faker');
const request = require('supertest');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { sequelize, Project, User } = require('../../models');
const app = require('../../app');

const apiUrl = '/api/projects';

Faker.locale = 'fr';
const password = '123456';
let hashedPassword;

describe('Manage Projects Test', function() {
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    await sequelize.sync({ force: true });
  });

  describe('GET /api/projects', function() {
    it('should respond to the GET /projects', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const res = await request(app)
        .get(apiUrl)
        .set('x-auth-token', user.token);

      expect(res.status).toBe(200);
    });

    it('should read projects only if user is authenticated', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: Faker.lorem.sentence(),
        description: Faker.lorem.paragraph()
      };
      let project = await Project.create(body);
      project = await project.setOwner(null);

      const res = await request(app)
        .get(apiUrl)
        .set('x-auth-token', user.token);

      expect(res.body).toEqual(
        expect.arrayContaining([JSON.parse(JSON.stringify(project))])
      );
    });

    it('should return 401 if user is not authenticated', async function() {
      const res = await request(app).get(apiUrl);

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects', () => {
    it('should avoid unauthenticated users', async function() {
      const res = await request(app).post(apiUrl);

      expect(res.status).toBe(401);
    });

    it('should create a project only if user is authenticated', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: Faker.lorem.sentence(),
        description: Faker.lorem.paragraph()
      };

      const res = await request(app)
        .post(apiUrl)
        .set('x-auth-token', user.token)
        .send(body);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining(body));
    });

    it('should return 400 if title is not provided', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = { description: 'test description' };

      const res = await request(app)
        .post(apiUrl)
        .set('x-auth-token', user.token)
        .send(body);

      expect(res.status).toBe(400);
    });

    it('should return 400 if description is not provided', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = { title: 'test title' };

      const res = await request(app)
        .post(apiUrl)
        .set('x-auth-token', user.token)
        .send(body);

      expect(res.status).toBe(400);
    });

    it('should return 400 if title and description are not provided', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {};

      const res = await request(app)
        .post(apiUrl)
        .set('x-auth-token', user.token)
        .send(body);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/projects/:projectId', () => {
    it('should avoid unauthenticated users', async function() {
      const res = await request(app).get(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should get a single project', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: Faker.lorem.sentence(),
        description: Faker.lorem.paragraph()
      };
      const project = await Project.create(body);

      const res = await request(app)
        .get(`${apiUrl}/${project.id}`)
        .set('x-auth-token', user.token);

      expect(res.body).toEqual(
        expect.objectContaining(JSON.parse(JSON.stringify(project)))
      );
    });

    it('should return 404 if any project found', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      await Project.create({
        title: `project`,
        description: `description`
      });

      const res = await request(app)
        .get(`${apiUrl}/2`)
        .set('x-auth-token', user.token);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/projects/:projectId', () => {
    it('should avoid unauthenticated users', async function() {
      const res = await request(app).patch(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should update an existing project', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      let project = await Project.create(body);
      project = JSON.parse(JSON.stringify(project));

      const res = await request(app)
        .patch(`${apiUrl}/${project.id}`)
        .set('x-auth-token', user.token)
        .send({ title: 'title updated', description: 'description updated' });

      expect(res.body).toEqual(
        expect.objectContaining(
          _.pick(
            _.assign({}, project, {
              title: 'title updated',
              description: 'description updated'
            }),
            ['id', 'title', 'description']
          )
        )
      );
    });

    it('should return 404 when updating if any project found', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      await Project.create(body);

      const res = await request(app)
        .patch(`${apiUrl}/2`)
        .set('x-auth-token', user.token)
        .send({ title: 'title updated' });

      expect(res.status).toBe(404);
    });

    it('should return 400 when updating if description is missing', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      const project = await Project.create(body);

      const res = await request(app)
        .patch(`${apiUrl}/${project.id}`)
        .set('x-auth-token', user.token)
        .send({ title: 'title updated' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when updating if title is missing', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      const project = await Project.create(body);

      const res = await request(app)
        .patch(`${apiUrl}/${project.id}`)
        .set('x-auth-token', user.token)
        .send({ description: 'description updated' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/projects/:projectId', () => {
    it('should avoid unauthenticated users', async function() {
      const res = await request(app).delete(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should delete an existing project', async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      await Project.create(body);
      await Project.create(body);
      let project = await Project.create(body);
      project = JSON.parse(JSON.stringify(project));

      const res = await request(app)
        .delete(`${apiUrl}/${project.id}`)
        .set('x-auth-token', user.token);

      const projects = await Project.findAll();

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(project));
      expect(JSON.parse(JSON.stringify(projects))).toEqual(
        expect.not.arrayContaining([project])
      );
    });

    it("should return 404 when deleting a project that doesn't exist", async function() {
      const user = await User.create({
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: hashedPassword
      });

      const body = {
        title: `project`,
        description: `description`
      };

      await Project.create(body);

      const res = await request(app)
        .delete(`${apiUrl}/2`)
        .set('x-auth-token', user.token);

      expect(res.status).toBe(404);
    });
  });
});
