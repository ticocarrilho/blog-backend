const faker = require('faker');

module.exports = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isAdmin: false,
};
