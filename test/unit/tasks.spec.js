const faker = require('faker');
const { sequelize, Task, Project } = require(__dirname + '/../../models');

describe('Task', () => {
  let task;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    task = await Task.create({ body: faker.lorem.sentence() });
  });

  it('should belong to a project', async () => {
    const project = await Project.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    });
    await project.addTask(task);
    task = await Task.findByPk(task.id); // refresh the model
    const taskProject = await task.getProject();

    expect(taskProject).toBeInstanceOf(Project);
  });
});
