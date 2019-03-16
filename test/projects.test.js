const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

const apiUrl = '/api/projects';

describe('ProjectsTest', function() {
  beforeAll(() => {
    sequelize.sync({ force: true });
  });

  it('should response to the GET method', function() {
    return request(app)
      .get(apiUrl)
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  it('should create a project', function() {
    return request(app)
      .post(apiUrl)
      .send({
        title: 'My super project title',
        description: 'My super project description'
      })
      .set('Content-Type', 'application/json')
      .then(() => {
        return request(app)
          .get(apiUrl)
          .then((response) => {
            exports(response).contains({
              title: 'My super project title',
              description: 'My super project description'
            });
          });
      });
  });
});
