const faker = require('faker');

const { User, Project, Activity, sequelize } = require('../../models');

describe('Activity', () => {
  faker.locale = 'fr';

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should belong to a user', async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    });

    const project = await Project.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    });
    await project.setOwner(user);

    let activity = await Activity.create({
      description: faker.lorem.paragraph()
    });
    activity = await activity.setProject(project);
    activity = await activity.setUser(user);

    expect(activity.user_id).toBeTruthy();

    const activityUser = await activity.getUser();
    expect(activityUser.id).toBe(user.id);
    expect(activityUser).toBeInstanceOf(User);
  });
});
