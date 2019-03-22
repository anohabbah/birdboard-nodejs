'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
  });

  Project.associate = function({ User }) {
    // associations can be defined here
    Project.belongsTo(User, {
      foreignKey: 'owner_id',
      onDelete: 'cascade',
      as: 'Owner'
    });
  };

  return Project;
};
