const faker = require('faker');
const request = require('supertest');
const app = require('../../app');

const { sequelize, Project, User, Task } = require(__dirname + '/../../models');

faker.locale = 'fr';

describe('Project Tasks', () => {
  let project;
  let user;
  let params;
  let url;
  let token;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    project = await Project.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    });

    user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    await project.setOwner(user);

    token = user.token;

    params = { body: faker.lorem.word() };
    url = '/api/projects/' + project.id + '/tasks';
  });

  describe('POST /api/projects/:projectId/tasks', () => {
    const exec = async () => {
      return request(app)
        .post(url)
        .set('x-auth-token', token)
        .send(params);
    };

    it('a project can have tasks ', async () => {
      await exec();

      const task = await Task.findOne({ where: params });
      const tasks = await project.getTasks();

      expect(task).toBeTruthy();
      expect(tasks).toEqual(expect.arrayContaining([task]));
    });

    it('task body is required', async () => {
      params = {};
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should not add a task to a project when you are not the owner', async () => {
      const anotherUser = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      });
      token = anotherUser.token;
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should avoid adding a task when the project doesnt exist', async () => {
      url = '/api/projects/3/tasks';
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/projects/:projectId/tasks/:taskId', () => {
    let task;
    beforeEach(async () => {
      task = await Task.create(params);
      task = await task.setProject(project);
    });

    const exec = async () => {
      return request(app)
        .patch(url)
        .set('x-auth-token', token)
        .send(params);
    };

    it('should not update a task to a project when you are not the owner', async () => {
      const anotherUser = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      });
      token = anotherUser.token;
      url = task.path;
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should avoid updating a task when the project doesnt exist', async () => {
      url = '/api/projects/3/tasks/2';
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });
});
