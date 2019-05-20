'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
      },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false }
    },
    {
      getterMethods: {
        path() {
          return [
            '',
            'api',
            'projects',
            this.get('projectId'),
            'tasks',
            this.get('id')
          ].join('/');
        }
      },
      setterMethods: {
        complete(value) {
          this.set('completed', value);
        },
        incomplete(value) {
          this.set('completed', value);
        }
      }
    }
  );
  Task.associate = function({ Project }) {
    Task.belongsTo(Project, { as: 'project', onDelete: 'cascade' });
  };

  return Task;
};
