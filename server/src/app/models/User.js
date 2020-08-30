const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
  },{
    hooks:{
      beforeSave: async user => {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Post, { foreignKey: 'user_id', as: 'users' });
    User.hasMany(models.Commentary, {
      foreignKey: 'user_id',
      as: 'user_commentary',
    });
  }
  User.prototype.generateToken = function() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
  };
  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
  }
  return User
};
