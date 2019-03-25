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
        }
      }
    }
  );
  Activity.associate = function({ User, Project, Task }) {
    Activity.belongsTo(User);
    Activity.belongsTo(Project);
    Activity.belongsTo(Task, { foreignKey: 'subject_id' });
  };
  return Activity;
};
