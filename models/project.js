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
        },
        ownerId() {
          return this.getDataValue('owner_id');
        }
      },
      hooks: {
        async afterCreate(model) {
          const activity = await this.associations['Activities'].target.create({
            description: 'created_project',
            subject_id: model.id,
            subject_type: 'Project'
          });
          await model.addActivity(activity);
        },
        async afterUpdate(model) {
          const activity = await this.associations['Activities'].target.create({
            description: 'updated_project',
            subject_id: model.id,
            subject_type: 'Project'
          });
          await model.addActivity(activity);
        }
      }
    }
  );

  Project.associate = function({ User, Task, Activity }) {
    Project.belongsTo(User, {
      foreignKey: 'owner_id',
      onDelete: 'cascade',
      as: 'Owner'
    });

    Project.hasMany(Task, { onDelete: 'cascade', as: 'Tasks' });
    Project.hasMany(Activity, { onDelete: 'cascade', as: 'Activities' });
  };

  return Project;
};
