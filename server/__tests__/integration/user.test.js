const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const { getAuthCookie } = require('../utils/getAuthCookie');

let csrf, cookies;

describe('Authentication /users', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
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
      .post('/api/user/login')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'test123',
      });

    expect(response.status).toBe(401);
  });

  it('should return a cookie token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'test',
      });

    expect(response.headers['set-cookie'][0]).toInclude('token');
  });
});

describe('Register /users', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to create an account and return a cookie token', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
        name: 'test test',
        email: 'test@email.com',
        password: 'test',
      });
      
    expect(response.headers['set-cookie'][0]).toInclude('token');
  });

  it('should not be able to create an account with an email that already exists', async () => {
    const user = await factory.create('User', {
      email: 'test@email.com',
    });
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
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

    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'test123',
      });

    expect(response.status).toBe(401);
  });
});

describe('GET /users', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to get all users', async () => {
    await factory.createMany('User', 10);

    const response = await request(app)
      .get(`/api/user`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });

    expect(response.body).toHaveLength(10);
  });
  it('should be able to get an user', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/api/user/${user.id}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });

    expect(response.body.id).toBe(user.id);
  });
  it('should return 404 when trying to get an user that does not exists', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/api/user/${user.id + 20}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /users', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to delete an user when authenticated as an admin', async () => {
    const userAdmin = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    const user = await factory.create('User');

    let cookie = await getAuthCookie(userAdmin.email, 'admin', csrf, cookies);

    const response = await request(app).delete(`/api/user/${user.id}`).set({
      'X-CSRF-Token': csrf,
      Cookie: cookie,
    });

    expect(response.status).toBe(200);
  });

  it('should return 400 when trying to delete an user that does not exists', async () => {
    const userAdmin = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(userAdmin.email, 'admin', csrf, cookies);

    const response = await request(app)
      .delete(`/api/user/${userAdmin.id + 20}`)
      .set({
        'X-CSRF-Token': csrf,
        Cookie: cookie,
      });
    expect(response.status).toBe(400);
  });

  it('should not be able to delete an user when not authenticated as an admin', async () => {
    const userA = await factory.create('User', {
      password: 'test',
    });
    const userB = await factory.create('User');

    let cookie = await getAuthCookie(userA.email, 'test', csrf, cookies);

    const response = await request(app).delete(`/api/user/${userB.id}`).set({
      'X-CSRF-Token': csrf,
      Cookie: cookie,
    });

    expect(response.status).toBe(401);
  });
});

describe('UPDATE /users', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to edit an user', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .patch(`/api/user/${user.id}`)
      .send({
        email: 'new@email.com',
      })
      .set({
        'X-CSRF-Token': csrf,
        Cookie: cookie,
      });

    expect(response.status).toBe(200);
  });

  it('should return 400 when trying to edit an user that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .patch(`/api/user/${user.id + 20}`)
      .send({
        email: 'new@email.com',
      })
      .set({
        'X-CSRF-Token': csrf,
        Cookie: cookie,
      });

    expect(response.status).toBe(400);
  });
});
