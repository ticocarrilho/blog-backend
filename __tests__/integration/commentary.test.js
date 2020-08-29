const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');
const { getAuthCookie } = require('../utils/getAuthCookie');

let csrf, cookies;

describe('POST /post/:postId/comment', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to comment a post', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .post(`/post/${post.id}/comment`)
      .send({
        content: 'commentary',
      })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });
    expect(response.status).toBe(201);
  });

  it('should not be able to comment a post that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .post(`/post/${post.id + 99}/comment`)
      .send({
        content: 'commentary',
      })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});

describe('GET /post/:postId/comment', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('should be able to get all commentaries from a post', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    await factory.createMany('Commentary', 10, {
      user_id: user.id,
      post_id: post.id,
    });

    const response = await request(app)
      .get(`/post/${post.id}/comment`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies });
    expect(response.body).toHaveLength(10);
  });
});

describe('PATCH /post/comment/:commentId', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('the commentary author should be able to edit its commentaries ', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });
    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .patch(`/post/comment/${commentary.id}`)
      .send({ content: 'New Content' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });

  it('should return 401 when an user tries to edit someone else commentaries ', async () => {
    const userA = await factory.create('User');
    const userB = await factory.create('User', {
      password: 'test',
    });

    const post = await factory.create('Post', {
      user_id: userA.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: userA.id,
      post_id: post.id,
    });
    let cookie = await getAuthCookie(userB.email, 'test', csrf, cookies);

    const response = await request(app)
      .patch(`/post/comment/${commentary.id}`)
      .send({ content: 'New Content' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(401);
  });

  it('should return 404 when an user tries to edit a non existing commentary ', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });
    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .patch(`/post/comment/${commentary.id + 99}`)
      .send({ content: 'New Content' })
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /post/comment/:commentId', () => {
  beforeEach(async () => {
    await truncate();
    const getCsrf = await request(app).get('/csrf-token');
    csrf = getCsrf.body.csrfToken;
    cookies = getCsrf.headers['set-cookie'];
  });
  it('the commentary author should be able to delete its commentaries ', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .delete(`/post/comment/${commentary.id}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });

  it('should return 401 when an user tries to delete someone else commentaries ', async () => {
    const userA = await factory.create('User');
    const userB = await factory.create('User', {
      password: 'test',
    });

    const post = await factory.create('Post', {
      user_id: userA.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: userA.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(userB.email, 'test', csrf, cookies);

    const response = await request(app)
      .delete(`/post/comment/${commentary.id}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(401);
  });

  it('should return 404 when an user tries to delete a non existing commentary ', async () => {
    const user = await factory.create('User', {
      password: 'test',
    });

    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(user.email, 'test', csrf, cookies);

    const response = await request(app)
      .delete(`/post/comment/${commentary.id + 99}`)
      .set({ 'X-CSRF-Token': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});
