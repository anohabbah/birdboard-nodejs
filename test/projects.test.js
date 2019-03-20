const request = require('supertest');
const { sequelize, Project } = require('../models');
const app = require('../app');

const apiUrl = '/api/projects';

describe('ProjectsTest', function() {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should respond to the GET /projects', async function() {
    const response = await request(app).get(apiUrl);
    expect(response.statusCode).toBe(200);
  });

  it('should read projects', async function() {
    const project = await Project.create({
      title: `project`,
      description: `description`
    });

    const response = await request(app).get(apiUrl);
    expect(response.body).toEqual(
      expect.arrayContaining([JSON.parse(JSON.stringify(project))])
    );
  });

  it('should create a project', async function() {
    const body = { title: 'test title', description: 'test description' };

    const res = await request(app)
      .post(apiUrl)
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expect.objectContaining(body));
  });
});
