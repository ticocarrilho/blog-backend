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
  let newCookie = cookies;
  cookie.headers['set-cookie'].forEach((cookie) => {
    newCookie += `; ${cookie}`;
  });
  return newCookie;
};

module.exports = { getAuthCookie };
