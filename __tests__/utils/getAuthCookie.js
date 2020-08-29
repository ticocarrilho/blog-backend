const request = require('supertest');
const app = require('../../src/app');

const getAuthCookie = async (email, password, csrf, cookies) => {
  let cookie = await request(app)
      .post('/user/login')
      .set({ 'X-CSRF-Token': csrf, Cookie: cookies })
      .send({
        email: email,
        password: password,
      });
    return cookies.toString().replace('Path=/', '') + cookie.headers['set-cookie'];
}

module.exports = { getAuthCookie }