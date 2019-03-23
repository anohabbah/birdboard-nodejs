const faker = require('faker');
const request = require('supertest');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { sequelize, Project, User } = require('../../models');
const app = require('../../app');

describe('Manage Projects Test', function() {
  faker.locale = 'fr';
  let token;
  let attributes;
  const apiUrl = '/api/projects';
  const password = '123456';
  let hashedPassword;
  let user;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: hashedPassword
    });

    token = user.token;

    attributes = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    };
  });

  describe('GET /api/projects', function() {
    const exec = async () => {
      return await request(app)
        .get(apiUrl)
        .set('x-auth-token', token);
    };

    it('should respond to the GET /projects', async function() {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should read projects only if user is authenticated', async function() {
      const body = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph()
      };
      let project = await Project.create(body);
      project = await project.setOwner(null);

      const res = await exec();

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
    const exec = async () => {
      return await request(app)
        .post(apiUrl)
        .set('x-auth-token', token)
        .send(attributes);
    };

    it('should avoid unauthenticated users', async function() {
      const res = await request(app).post(apiUrl);

      expect(res.status).toBe(401);
    });

    it('should create a project only if user is authenticated', async function() {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.objectContaining(attributes));
    });

    it('should return 400 if title is not provided', async function() {
      attributes = { description: 'test description' };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if description is not provided', async function() {
      attributes = { title: 'test title' };

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title and description are not provided', async function() {
      attributes = {};

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/projects/:projectId', () => {
    let endpoint;

    const exec = async () => {
      return await request(app)
        .get(endpoint)
        .set('x-auth-token', token);
    };

    it('should avoid unauthenticated users', async function() {
      const res = await request(app).get(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should get a single project', async function() {
      const project = await Project.create(attributes);
      endpoint = `${apiUrl}/${project.id}`;
      const res = await exec();

      expect(res.body).toEqual(
        expect.objectContaining(JSON.parse(JSON.stringify(project)))
      );
    });

    it('should return 404 if any project found', async function() {
      await Project.create(attributes);

      endpoint = `${apiUrl}/2`;
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/projects/:projectId', () => {
    let url;
    let params;
    let project;
    beforeEach(async () => {
      project = await Project.create(attributes);
      await project.setOwner(user);
    });

    const exec = async () => {
      return await request(app)
        .patch(url)
        .set('x-auth-token', token)
        .send(params);
    };

    it('should avoid unauthenticated users', async function() {
      const res = await request(app).patch(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should not update a project if you are not the project owner', async () => {
      const anotherUser = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      });

      url = `${apiUrl}/${project.id}`;
      token = anotherUser.token;
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should update an existing project', async function() {
      url = `${apiUrl}/${project.id}`;
      params = { title: 'title updated', description: 'description updated' };
      const res = await exec();

      project = JSON.parse(JSON.stringify(project));
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
      params = null;
      url = `${apiUrl}/${project.id}`;
      url = apiUrl + '/2';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 when updating if description is missing', async function() {
      params = { title: 'title updated' };
      url = `${apiUrl}/${project.id}`;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 when updating if title is missing', async function() {
      params = { description: 'description updated' };
      url = `${apiUrl}/${project.id}`;
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/projects/:projectId', () => {
    let url;
    let project;
    beforeEach(async () => {
      project = await Project.create(attributes);
    });

    const exec = async () => {
      return await request(app)
        .delete(url)
        .set('x-auth-token', token);
    };

    it('should avoid unauthenticated users', async function() {
      const res = await request(app).delete(apiUrl + '/1');

      expect(res.status).toBe(401);
    });

    it('should delete an existing project', async function() {
      await Project.create(attributes);
      await Project.create(attributes);
      project = JSON.parse(JSON.stringify(project));

      url = `${apiUrl}/${project.id}`;
      const res = await exec();

      const projects = await Project.findAll();

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(project));
      expect(JSON.parse(JSON.stringify(projects))).toEqual(
        expect.not.arrayContaining([project])
      );
    });

    it("should return 404 when deleting a project that doesn't exist", async function() {
      url = `${apiUrl}/2`;
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });
});
