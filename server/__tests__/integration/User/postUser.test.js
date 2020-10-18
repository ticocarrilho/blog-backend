const request = require('supertest');

const app = require('../../../src/app');
const truncate = require('../../utils/truncate');
const factory = require('../../factories');
const userInfo = require('../../userInfo');

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

describe('POST /users', () => {
  it('should be able to create an account and return a cookie token', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send(userInfo);

    expect(response.headers['set-cookie'][0]).toInclude('token');
  });

  it('should not be able to create an account with an email that already exists', async () => {
    await factory.create('User', {
      email: 'test@email.com',
    });
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({
        ...userInfo,
        email: 'test@email.com',
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to create an account without a name', async () => {
    const { name, ...userWithoutName } = userInfo;
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send(userWithoutName);
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account with an empty name', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({ ...userInfo, name: ' ' });
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account without an email', async () => {
    const { email, ...userWithoutEmail } = userInfo;
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send(userWithoutEmail);
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account with an empty email', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({ ...userInfo, email: ' ' });
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account with an invalid email format', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({ ...userInfo, email: 'invalid@email' });
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account without a password', async () => {
    const { password, ...userWithoutPassword } = userInfo;
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send(userWithoutPassword);
    expect(response.status).toBe(400);
  });

  it('should not be able to create an account with an empty password', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({...userInfo, password: '        '});
    expect(response.status).toBe(400);
  });


  it('should not be able to create an account with a password that has less than 8 characters', async () => {
    const response = await request(app)
      .post('/api/user')
      .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
      .send({ ...userInfo, password: '1234' });
    expect(response.status).toBe(400);
  });
});
