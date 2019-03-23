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
          return '/api/projects/' + this.getDataValue('id');
        }
      }
    }
  );

  Project.associate = function({ User, Task }) {
    // associations can be defined here
    Project.belongsTo(User, {
      foreignKey: 'owner_id',
      onDelete: 'cascade',
      as: 'Owner'
    });

    Project.hasMany(Task, { onDelete: 'cascade', as: 'Tasks' });
  };

  return Project;
};
