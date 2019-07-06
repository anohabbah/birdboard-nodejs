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

  it('should have a path', async () => {
    const project = await Project.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    });
    await project.addTask(task);
    await task.reload();

    expect(task.path).toBe('/api/projects/' + project.id + '/tasks/' + task.id);
  });

  it('should be marked as complete', async () => {
    expect(task.completed).toBeFalsy();

    task.complete = true;
    task = await task.save();

    expect(task.completed).toBeTruthy();
  });

  it('should be marked as incomplete', async () => {
    task = await Task.create({ body: faker.lorem.sentence(), completed: true });

    expect(task.completed).toBeTruthy();

    task.incomplete = false;
    expect(task.completed).toBeFalsy();

    task = await task.save();
  });
});
