'use strict';

const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, isEmail: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [6, 255] }
      }
    },
    {
      getterMethods: {
        token() {
          return jwt.sign(
            {
              id: this.getDataValue('id'),
              email: this.getDataValue('email'),
              name: this.getDataValue('name')
            },
            process.env.JWT_TOKEN
          );
        }
      }
    }
  );
  User.associate = function({ Project }) {
    // associations can be defined here
    User.hasMany(Project, {
      foreignKey: 'owner_id',
      as: 'Projects',
      onDelete: 'cascade'
    });
  };

  return User;
};
