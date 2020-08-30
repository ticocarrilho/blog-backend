const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const { getAuthCookie } = require('../utils/getAuthCookie');

let csrf, cookies;

describe('GET /post', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to get a posts', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post/${post.id}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });
    expect(response.status).toBe(200);
  });

  it('should be able to get all posts', async () => {
    const user = await factory.create('User');
    await factory.createMany('Post', 10, {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });

    expect(response.body).toHaveLength(10);
  });

  it('should return 404 when trying to get a post that does not exists', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post/${post.id + 10}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });

    expect(response.status).toBe(404);
  });
});

describe('POST /post', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('an authenticaded user should be able to make a post', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .post('/api/post')
      .send({ title: 'test', content: 'testcontent' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(201);
  });
  it('an post should have the authenticaded user id', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .post('/api/post')
      .send({ title: 'test', content: 'testcontent' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.body.user_id).toBe(user.id);
  });
});

describe('PATCH /post', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('an authenticaded user should be able to edit a post', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/${post.id}`)
      .send({ title: 'New title' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });
  it('should return 404 when trying to edit a post that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/${post.id + 99}`)
      .send({ title: 'test', content: 'testcontent' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /post', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/api/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('an authenticaded user should be able to delete a post', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .delete(`/api/post/${post.id}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });
  it('should return 404 when trying to delete a post that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'admin',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'admin', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/${post.id + 99}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });
    expect(response.status).toBe(404);
  });
});
