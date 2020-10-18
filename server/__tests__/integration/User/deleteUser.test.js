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

describe('DELETE /users', () => {
  it('should be able to delete an user when authenticated as an admin', async () => {
    const userAdmin = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });
    const user = await factory.create('User');

    let cookie = await getAuthCookie(userAdmin.email, 'testtest', csrf, cookies);

    const response = await request(app).delete(`/api/user/${user.id}`).set({
      'X-XSRF-TOKEN': csrf,
      Cookie: cookie,
    });

    expect(response.status).toBe(200);
  });

  it('should return 404 when trying to delete an user that does not exists', async () => {
    const userAdmin = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(userAdmin.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .delete(`/api/user/${userAdmin.id + 20}`)
      .set({
        'X-XSRF-TOKEN': csrf,
        Cookie: cookie,
      });
    expect(response.status).toBe(404);
  });

  it('should not be able to delete an user when not authenticated as an admin', async () => {
    const userA = await factory.create('User', {
      password: 'testtest',
    });
    const userB = await factory.create('User');

    let cookie = await getAuthCookie(userA.email, 'testtest', csrf, cookies);

    const response = await request(app).delete(`/api/user/${userB.id}`).set({
      'X-XSRF-TOKEN': csrf,
      Cookie: cookie,
    });

    expect(response.status).toBe(401);
  });
});