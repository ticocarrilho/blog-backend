const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');


describe('Authentication /users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login').send({
      email: user.email,
      password: 'test',
    });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login').send({
      email: user.email,
      password: 'test123',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login').send({
      email: user.email,
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });
});

describe('Register /users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to create an account and return a jwt token', async () => {
    const response = await request(app).post('/user').send({
      name: 'test test',
      email: 'test@email.com',
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to create an account with an email that already exists', async () => {
    const user = await factory.create('User', {
      email: 'test@email.com',
    });
    const response = await request(app).post('/user').send({
      name: 'test test',
      email: 'test@email.com',
      password: 'test',
    });

    expect(response.status).toBe(400);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login').send({
      email: user.email,
      password: 'test123',
    });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app).post('/user/login').send({
      email: user.email,
      password: 'test',
    });

    expect(response.body).toHaveProperty('token');
  });
});

describe('GET /users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to get all users', async () => {
    await factory.createMany('User', 10);

    const response = await request(app).get(`/user`);

    expect(response.body).toHaveLength(10);
  });
  it('should be able to get an user', async () => {
    const user = await factory.create('User');

    const response = await request(app).get(`/user/${user.id}`);

    expect(response.body.id).toBe(user.id);
  });
  it('should return 404 when trying to get an user that does not exists', async () => {
    const user = await factory.create('User');

    const response = await request(app).get(`/user/${user.id + 20}`);

    expect(response.status).toBe(404);
  });
});

describe('DELETE /users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to delete an user when authenticated as an admin', async () => {
    const userAdmin = await factory.create('User', {
      isAdmin: true,
    });
    const user = await factory.create('User');

    const response = await request(app)
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${userAdmin.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should return 400 when trying to delete an user that does not exists', async () => {
    const userAdmin = await factory.create('User', {
      isAdmin: true,
    });

    const response = await request(app)
      .delete(`/user/${userAdmin.id + 20}`)
      .set('Authorization', `Bearer ${userAdmin.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it('should not be able to delete an user when not authenticated as an admin', async () => {
    const userA = await factory.create('User');
    const userB = await factory.create('User');

    const response = await request(app)
      .delete(`/user/${userA.id}`)
      .set('Authorization', `Bearer ${userB.generateToken()}`);

    expect(response.status).toBe(401);
  });
});

describe('UPDATE /users', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to edit an user', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });

    const response = await request(app)
      .patch(`/user/${user.id}`)
      .send({
        email: 'new@email.com',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should return 400 when trying to edit an user that does not exists', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });

    const response = await request(app)
      .patch(`/user/${user.id + 20}`)
      .send({
        email: 'new@email.com',
      })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });
});
