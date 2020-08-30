const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Commentary = sequelize.define('Commentary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    content: DataTypes.STRING,
  });
  Commentary.associate = function(models) {
    Commentary.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_commentary' });
    Commentary.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post_commentary' });
  }
  return Commentary
};
