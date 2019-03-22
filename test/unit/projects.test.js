const Faker = require('faker');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { sequelize, User, Project } = require(__dirname + '/../../models');

Faker.locale = 'fr';
const password = '123456';
let hashedPassword;

describe('Projects Test', function() {
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    await sequelize.sync({ force: true });
  });

  it('should have an owner', async function() {
    const user = await User.create({
      name: Faker.name.findName(),
      email: Faker.internet.email(),
      password: hashedPassword
    });
    const project = await Project.create({
      title: Faker.lorem.sentence(),
      description: Faker.lorem.paragraph()
    });

    let projectOwner = await project.getOwner();

    expect(projectOwner).toBeNull();

    await project.setOwner(user);
    projectOwner = await project.getOwner();

    expect(projectOwner).toEqual(
      expect.objectContaining(_.pick(user, ['id', 'name', 'email']))
    );
  });
});
