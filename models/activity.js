'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    'Activity',
    {
      subject_type: { type: DataTypes.STRING },
      subject_id: { type: DataTypes.INTEGER },
      description: { type: DataTypes.TEXT },
      changes: { type: DataTypes.TEXT }
    },
    {
      getterMethods: {
        subjectType() {
          return this.getDataValue('subject_type');
        },
        subjectId() {
          return this.getDataValue('subject_id');
        },
        userId() {
          return this.getDataValue('user_id');
        },
        projectId() {
          return this.getDataValue('project_id');
        }
      }
    }
  );
  Activity.associate = function({ User, Project, Task }) {
    Activity.belongsTo(User, { as: 'User' });
    Activity.belongsTo(Project, { as: 'Project' });
    Activity.belongsTo(Task, { foreignKey: 'subject_id' });
  };
  return Activity;
};
