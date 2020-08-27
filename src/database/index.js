const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Post = require('../models/Post');
const Commentary = require('../models/Commentary');

const connection = new Sequelize(dbConfig);

User.init(connection);
Post.init(connection);
Commentary.init(connection);

User.associate(connection.models);
Post.associate(connection.models);
Commentary.associate(connection.models);

module.exports = connection;
