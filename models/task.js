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
          const act = await sequelize.models['Activity'].create({
            description: 'created_task',
            subject_type: 'Task',
            subject_id: model.id,
            project_id: model.project_id
          });
          console.log(act);
        }
      }
    }
  );
  Task.associate = function({ Project }) {
    Task.belongsTo(Project, { as: 'Project', onDelete: 'cascade' });
  };

  return Task;
};
