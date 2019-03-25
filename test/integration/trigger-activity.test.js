const request = require('supertest');
const _ = require('lodash');
const faker = require('faker');
const { sequelize, Project, Task, Activity } = require('../../models');

describe('Activity Trigger', () => {
  let project;

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    project = await Project.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    });
  });

  it('should trigger activity when creating a project', async () => {
    const projectActivities = await project.getActivities();

    expect(projectActivities.length).toBe(1);
    expect('created_project').toBe(_.first(projectActivities).description);
  });

  it('should trigger activity when updating a project', async () => {
    await project.update(
      { title: faker.lorem.sentence() },
      { individualHooks: true }
    );

    const projectActivities = await project.getActivities();

    expect(projectActivities.length).toBe(2);
    expect('updated_project').toBe(_.last(projectActivities).description);
  });
});
