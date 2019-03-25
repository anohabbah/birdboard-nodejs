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
        projectId() {
          return this.getDataValue('project_id');
        },
        path() {
          return [
            '',
            'api',
            'projects',
            this.getDataValue('project_id'),
            'tasks',
            this.getDataValue('id')
          ].join('/');
        }
      },
      setterMethods: {
        complete(value) {
          this.setDataValue('completed', value);
        },
        incomplete(value) {
          this.setDataValue('completed', value);
        }
      },
      hooks: {
        async afterCreate(model) {
          console.log(model.projectId);
          const project = await model.getProject();
          if (project) console.log(project.associations);
        }
      }
    }
  );
  Task.associate = function({ Project }) {
    Task.belongsTo(Project, { as: 'Project', onDelete: 'cascade' });
  };

  return Task;
};
