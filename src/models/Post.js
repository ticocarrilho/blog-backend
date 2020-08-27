const { Model, DataTypes } = require('sequelize');

class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        content: DataTypes.STRING,
      },
      { sequelize }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    this.hasMany(models.Commentary, { foreignKey: 'post_id', as: 'post_commentary' });
  }
}
module.exports = Post;
