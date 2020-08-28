const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');

beforeEach(async () => {
  await truncate();
});
describe('Authentication', () => {
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login')
    .send({
      email: user.email,
      password: 'test',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app)
    .post('/user/login')
    .send({
      email: user.email,
      password: 'test123',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login')
    .send({
      email: user.email,
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });
});

describe('Register', () => {
  it('should be able to create an account and return a jwt token', async () => {
    const response = await request(app)
    .post('/user')
    .send({
      name: 'test test',
      email: 'test@email.com',
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login')
    .send({
      email: user.email,
      password: 'test123',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login')
    .send({
      email: user.email,
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });
});

describe('DELETE /users', () => {
  it('should be able to delete an user when authenticated as an admin', async () => {
    const userAdmin = await factory.create('User', {
      password: 'test',
      isAdmin: true,
    });
    const user = await factory.create('User', {
      password: 'test1234',
    });

    const response = await request(app)
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${userAdmin.generateToken()}`);

    expect(response.status).toBe(200);
  });
  it('should not be able to delete an user when not authenticated as an admin', async () => {
    const userA = await factory.create('User', {
      password: 'test'
    });
    const userB = await factory.create('User', {
      password: 'test1234',
    });

    const response = await request(app)
      .delete(`/user/${userB.id}`)
      .set('Authorization', `Bearer ${userB.generateToken()}`);

    expect(response.status).toBe(401);
  });
});

describe('DELETE /users', () => {
  it('should be able to delete an user when authenticated as an admin', async () => {
    const userAdmin = await factory.create('User', {
      password: 'test',
      isAdmin: true,
    });
    const user = await factory.create('User', {
      password: 'test1234',
    });

    const response = await request(app)
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${userAdmin.generateToken()}`);

    expect(response.status).toBe(200);
  });
  it('should not be able to delete an user when not authenticated as an admin', async () => {
    const userA = await factory.create('User', {
      password: 'test',
    });
    const userB = await factory.create('User', {
      password: 'test1234',
    });

    const response = await request(app)
      .delete(`/user/${userB.id}`)
      .set('Authorization', `Bearer ${userB.generateToken()}`);

    expect(response.status).toBe(401);
  });
});


describe('UPDATE /users', () => {
  it('should be able to edit an user', async () => {
    const user = await factory.create('User', {
      isAdmin: true
    });

    const response = await request(app)
      .patch(`/user/${user.id}`)
      .send({
        email: 'new@email.com',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(201);
  });
});
