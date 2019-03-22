const request = require('supertest');
const _ = require('lodash');
const { sequelize, Project } = require('../../models');
const app = require('../../app');

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

  it('should get a single project', async function() {
    const project = await Project.create({
      title: `project`,
      description: `description`
    });

    const res = await request(app).get(`${apiUrl}/${project.id}`);

    expect(res.body).toEqual(JSON.parse(JSON.stringify(project)));
  });

  it('should return 404 if any project found', async function() {
    await Project.create({
      title: `project`,
      description: `description`
    });

    const res = await request(app).get(`${apiUrl}/2`);

    expect(res.status).toBe(404);
  });

  it('should update an existing project', async function() {
    const body = {
      title: `project`,
      description: `description`
    };

    let project = await Project.create(body);
    project = JSON.parse(JSON.stringify(project));

    const res = await request(app)
      .patch(`${apiUrl}/${project.id}`)
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
    const body = {
      title: `project`,
      description: `description`
    };

    await Project.create(body);

    const res = await request(app)
      .patch(`${apiUrl}/2`)
      .send({ title: 'title updated' });

    expect(res.status).toBe(404);
  });

  it('should return 400 when updating if description is missing', async function() {
    const body = {
      title: `project`,
      description: `description`
    };

    const project = await Project.create(body);

    const res = await request(app)
      .patch(`${apiUrl}/${project.id}`)
      .send({ title: 'title updated' });

    expect(res.status).toBe(400);
  });

  it('should return 400 when updating if title is missing', async function() {
    const body = {
      title: `project`,
      description: `description`
    };

    const project = await Project.create(body);

    const res = await request(app)
      .patch(`${apiUrl}/${project.id}`)
      .send({ description: 'description updated' });

    expect(res.status).toBe(400);
  });

  it('should delete an existing project', async function() {
    const body = {
      title: `project`,
      description: `description`
    };

    await Project.create(body);
    await Project.create(body);
    let project = await Project.create(body);
    project = JSON.parse(JSON.stringify(project));

    const res = await request(app).delete(`${apiUrl}/${project.id}`);
    const resp = await request(app).get(apiUrl);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining(project));
    expect(resp.body).toEqual(expect.not.arrayContaining([project]));
  });

  it("should return 404 when deleting a project that doesn't exist", async function() {
    const body = {
      title: `project`,
      description: `description`
    };

    await Project.create(body);

    const res = await request(app).delete(`${apiUrl}/2`);

    expect(res.status).toBe(404);
  });

  it('should belong to an owner', async function() {});
});
