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

describe('DELETE /post', () => {
  it('an authenticaded user should be able to delete a post', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .delete(`/api/post/${post.id}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(200);
  });
  it('should return 404 when trying to delete a post that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .patch(`/api/post/${post.id + 99}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });
    expect(response.status).toBe(404);
  });
});
