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

describe('PATCH /post/comment/:commentId', () => {
  it('the commentary author should be able to edit its commentaries ', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/comment/${commentary.id}`)
      .send({ content: 'New Content' })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });

  it('should return 401 when an user tries to edit someone else commentaries ', async () => {
    const password = 'testtesttest';
    const email = 'test@test.com';
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
      .patch(`/api/post/comment/${commentary.id}`)
      .send({ content: 'New Content' })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(401);
  });

  it('should return 404 when an user tries to edit a non existing commentary ', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const commentary = await factory.create('Commentary', {
      user_id: user.id,
      post_id: post.id,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/comment/${commentary.id + 99}`)
      .send({ content: 'New Content' })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(404);
  });
});
