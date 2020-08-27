const { Model, DataTypes } = require('sequelize');

class Commentary extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        content: DataTypes.STRING,
      },
      { sequelize }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_commentary' });
    this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post_commentary' });
  }
}
module.exports = Commentary;
