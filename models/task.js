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
    {}
  );
  Task.associate = function({ Project }) {
    Task.belongsTo(Project, { as: 'Project', onDelete: 'cascade' });
  };

  return Task;
};
