const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const truncate = require('../utils/truncate');
const factory = require('../factories');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should encrypt the user password', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const compareHash = await bcrypt.compare('testtest', user.password);

    expect(compareHash).toBe(true);
  });

  it('should return true with the right password', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const comparePassword = await user.checkPassword('testtest');

    expect(comparePassword).toBe(true);
  });

  it('should return false with the wrong password', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const comparePassword = await user.checkPassword('wrong');

    expect(comparePassword).toBe(false);
  });

  it('should generate a valid jwt token with the user id', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const token = await user.generateToken();

    let id;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        id = err;
      }
      id = decoded.id;
    });

    expect(user.id === id).toBe(true);
  });
});
