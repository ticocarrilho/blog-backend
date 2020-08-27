const { Model, DataTypes } = require('sequelize');

class Commentaries extends Model {
  static init(sequelize) {
    super.init(
      {
        content: DataTypes.STRING,
      },
      { sequelize }
    );
  }
}
module.exports = Commentaries;
