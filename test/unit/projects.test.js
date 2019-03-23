const Faker = require('faker');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { sequelize, User, Project, Task } = require(__dirname + '/../../models');

describe('Project', () => {
  let project;
  Faker.locale = 'fr';
  const password = '123456';
  let hashedPassword;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    project = await Project.create({
      title: Faker.lorem.sentence(),
      description: Faker.lorem.paragraph()
    });
  });

  it('should belong to an owner', async () => {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name: Faker.name.findName(),
      email: Faker.internet.email(),
      password: hashedPassword
    });

    let projectOwner = await project.getOwner();

    expect(projectOwner).toBeNull();

    await project.setOwner(user);
    projectOwner = await project.getOwner();

    expect(projectOwner).toBeInstanceOf(User);
  });

  it('should have a path', () => {
    expect(project.path).toBe('/api/projects/' + project.id);
  });

  it('should add a task', async () => {
    let task = await Task.create({ body: Faker.lorem.sentence() });
    await project.addTask(task);

    const tasks = await project.getTasks();
    task = await Task.findByPk(task.id);
    expect(JSON.parse(JSON.stringify(tasks))).toEqual(
      expect.arrayContaining([JSON.parse(JSON.stringify(task))])
    );
  });
});
