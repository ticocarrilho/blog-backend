const request = require('supertest');

const app = require('../../../src/app');
const truncate = require('../../utils/truncate');
const factory = require('../../factories');
const { getAuthCookie } = require('../../utils/getAuthCookie');

let csrf, cookies;

beforeEach(async () => {
  await truncate();
  const getCsrf = await request(app).get('/api/csrf-token');
  cookiesArray = getCsrf.headers['set-cookie'].map(
    (cookie) => cookie.split(';')[0]
  );
  csrf = cookiesArray[1].replace('XSRF-TOKEN=', '');
  cookies = cookiesArray.toString().replace(',', '; ');
});

describe('POST /post/:postId/comment', () => {
  it('should be able to comment a post', async () => {
    const user = await factory.create('User', {
      password: 'testtesttest',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    let cookie = await getAuthCookie(user.email, 'testtesttest', csrf, cookies);

    const response = await request(app)
      .post(`/api/post/${post.id}/comment`)
      .send({
        content: 'commentary',
      })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });
    expect(response.status).toBe(201);
  });

  it('should not be able to comment a post that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'testtesttest',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'testtesttest', csrf, cookies);

    const response = await request(app)
      .post(`/api/post/${post.id + 99}/comment`)
      .send({
        content: 'commentary',
      })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /post/comment/:commentId', () => {
  it('the commentary author should be able to delete its commentaries ', async () => {
    const user = await factory.create('User', {
      password: 'testtesttest',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(user.email, 'testtesttest', csrf, cookies);

    const response = await request(app)
      .delete(`/api/post/comment/${commentary.id}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });

  it('should return 401 when an user tries to delete someone else commentaries ', async () => {
    const password = 'testtesttesttesttesttesttesttesttest';
    const email = 'testtesttest@testtesttest.com';
    const userA = await factory.create('User');
    const userB = await factory.create('User', {
      email,
      password,
    });

    const post = await factory.create('Post', {
      user_id: userA.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: userA.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(email, password, csrf, cookies);

    const response = await request(app)
      .delete(`/api/post/comment/${commentary.id}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(401);
  });

  it('should return 404 when an user tries to delete a non existing commentary ', async () => {
    const password = 'testtesttesttesttesttesttesttesttest';
    const email = 'testtesttest@testtesttest.com';
    const user = await factory.create('User', {
      email,
      password,
    });

    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });

    let cookie = await getAuthCookie(email, password, csrf, cookies);

    const response = await request(app)
      .delete(`/api/post/comment/${commentary.id + 99}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});
