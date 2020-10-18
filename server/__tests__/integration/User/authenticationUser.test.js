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

describe('Authentication /users', () => {
  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });
    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'testtest',
      });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'testtest123',
      });

    expect(response.status).toBe(401);
  });

  it('should return a cookie token when authenticated', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
    });

    const response = await request(app)
      .post('/api/user/login')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({
        email: user.email,
        password: 'testtest',
      });

    expect(response.headers['set-cookie'][0]).toInclude('token');
  });
});
