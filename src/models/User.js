const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
      },
      { sequelize }
    );
    this.addHook('beforeCreate', 'beforeUpdate', async (user, options) => {
      user.password = await bcrypt.hash(user.password, 8);
    });
  }
  static associate(models) {
    this.hasMany(models.Post, { foreignKey: 'user_id', as: 'users' });
    this.hasMany(models.Commentary, { foreignKey: 'user_id', as: 'user_commentary' });
  }
}
module.exports = User;
