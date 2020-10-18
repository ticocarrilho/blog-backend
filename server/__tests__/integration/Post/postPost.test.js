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

describe('POST /post', () => {
  it('an authenticaded user should be able to make a post', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .post('/api/post')
      .send({ title: 'test', content: 'testcontent' })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.status).toBe(201);
  });
  it('an post should have the authenticaded user id', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .post('/api/post')
      .send({ title: 'test', content: 'testcontent' })
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookie });

    expect(response.body.user_id).toBe(user.id);
  });
});
