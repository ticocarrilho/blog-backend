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

describe('PATCH /users', () => {
  it('should be able to edit an user', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });

    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);

    const response = await request(app)
      .patch(`/api/user/${user.id}`)
      .send({
        email: 'new@email.com',
      })
      .set({
        'X-XSRF-TOKEN': csrf,
        Cookie: cookie,
      });

    expect(response.status).toBe(200);
  });

  it('should return 404 when trying to edit an user that does not exists', async () => {
    const user = await factory.create('User', {
      password: 'testtest',
      isAdmin: true,
    });
    let cookie = await getAuthCookie(user.email, 'testtest', csrf, cookies);
    const response = await request(app)
      .patch(`/api/user/${user.id + 20}`)
      .send({
        email: 'new@email.com',
      })
      .set({
        'X-XSRF-TOKEN': csrf,
        Cookie: cookie,
      });

    expect(response.status).toBe(404);
  });
});
