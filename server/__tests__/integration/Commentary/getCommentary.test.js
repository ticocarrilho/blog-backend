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
describe('GET /post/:postId/comment', () => {
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
      .get(`/api/post/${post.id}/comment`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });
    expect(response.body).toHaveLength(10);
  });
});
