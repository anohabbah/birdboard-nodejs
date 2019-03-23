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

    user = User.build({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    token = user.token;
  });

  const exec = async () => {
    return request(app)
      .post(url)
      .set('x-auth-token', token)
      .send(params);
  };

  it('a project can have tasks ', async () => {
    params = { body: faker.lorem.word() };
    url = '/api/projects/' + project.id + '/tasks';
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
});
