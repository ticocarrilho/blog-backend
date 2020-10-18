const request = require('supertest');

const app = require('../../../src/app');
const truncate = require('../../utils/truncate');
const factory = require('../../factories');

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

describe('GET /post', () => {
  it('should be able to get a posts', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post/${post.id}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });
    expect(response.status).toBe(200);
  });

  it('should be able to get all posts', async () => {
    const user = await factory.create('User');
    await factory.createMany('Post', 10, {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });

    expect(response.body).toHaveLength(10);
  });

  it('should return 404 when trying to get a post that does not exists', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app)
      .get(`/api/post/${post.id + 10}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });

    expect(response.status).toBe(404);
  });
});
