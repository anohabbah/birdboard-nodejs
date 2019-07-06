'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      getterMethods: {
        path() {
          return '/api/projects/' + this.get('id');
        }
      }
    }
  );

  Project.associate = function({ User, Task }) {
    // associations can be defined here
    Project.belongsTo(User, {
      onDelete: 'cascade',
      as: 'owner'
    });

    Project.hasMany(Task, { onDelete: 'cascade', as: 'tasks' });
  };

  return Project;
};
