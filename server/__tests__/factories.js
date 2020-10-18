const faker = require('faker');
const { factory } = require('factory-girl');
const { User, Post, Commentary } = require('../src/app/models');
const userInfo = require('./userInfo');

factory.define('User', User, userInfo);

factory.define('Post', Post, {
  title: faker.random.words(),
  content: faker.lorem.text(),
  user_id: 0
});

factory.define('Commentary', Commentary, {
  content: faker.lorem.text(),
  user_id: 0,
  post_id: 0
});

module.exports = factory;
