const request = require('supertest');
const app = require('../../src/app');

const getAuthCookie = async (email, password, csrf, cookies) => {
  let cookie = await request(app)
    .post('/api/user/login')
    .set({ 'X-XSRF-TOKEN': csrf, Cookie: cookies })
    .send({
      email: email,
      password: password,
    });
  return cookies + '; ' + cookie.headers['set-cookie'][0].split(';')[0];
};

module.exports = { getAuthCookie };
