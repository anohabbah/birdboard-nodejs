const request = require('supertest');
const { sequelize, Project } = require('../models');
const app = require('../app');

const apiUrl = '/api/projects';

describe('ProjectsTest', function() {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should respond to the GET /projects', async function() {
    const res = await request(app).get(apiUrl);
    expect(res.status).toBe(200);
  });

  it('should read projects', async function() {
    const project = await Project.create({
      title: `project`,
      description: `description`
    });

    const res = await request(app).get(apiUrl);
    expect(res.body).toEqual(
      expect.arrayContaining([JSON.parse(JSON.stringify(project))])
    );
  });

  it('should create a project', async function() {
    const body = { title: 'test title', description: 'test description' };

    const res = await request(app)
      .post(apiUrl)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(body));
  });

  it('should return 400 if title is not provided', async function() {
    const body = { description: 'test description' };

    const res = await request(app)
      .post(apiUrl)
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should return 400 if description is not provided', async function() {
    const body = { title: 'test title' };

    const res = await request(app)
      .post(apiUrl)
      .send(body);

    expect(res.status).toBe(400);
  });

  it('should return 400 if title and description are not provided', async function() {
    const body = {};

    const res = await request(app)
      .post(apiUrl)
      .send(body);

    expect(res.status).toBe(400);
  });
});
