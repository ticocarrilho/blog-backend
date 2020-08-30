const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
  });
  Post.associate = function(models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    Post.hasMany(models.Commentary, {
      foreignKey: 'post_id',
      as: 'post_commentary',
    });
  }
  return Post
};
