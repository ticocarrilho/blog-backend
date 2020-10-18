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

describe('GET /users', () => {
  it('should be able to get all users', async () => {
    await factory.createMany('User', 10);

    const response = await request(app)
      .get(`/api/user`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });

    expect(response.body).toHaveLength(10);
  });
  it('should be able to get an user', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/api/user/${user.id}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });

    expect(response.body.id).toBe(user.id);
  });
  it('should return 404 when trying to get an user that does not exists', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/api/user/${user.id + 20}`)
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies });

    expect(response.status).toBe(404);
  });
});