const faker = require('faker');
const { factory } = require('factory-girl');
const { User, Post, Commentary } = require('../src/app/models');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  isAdmin: false,
});

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
