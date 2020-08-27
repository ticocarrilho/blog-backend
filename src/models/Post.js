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
    this.belongsToMany(models.User, {
      foreignKey: 'post_id',
      through: models.Commentaries,
      as: 'Commentary',
    });
  }
}
module.exports = Post;
