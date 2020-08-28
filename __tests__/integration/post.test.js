const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories');

describe('GET /post', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able to get a posts', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app).get(`/post/${post.id}`);
    expect(response.status).toBe(200);
  });

  it('should be able to get all posts', async () => {
    const user = await factory.create('User');
    await factory.createMany('Post', 10, {
      user_id: user.id,
    });
    const response = await request(app).get(`/post`);

    expect(response.body).toHaveLength(10);
  });

  it('should return 404 when trying to get a post that does not exists', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', {
      user_id: user.id,
    });
    const response = await request(app).get(`/post/${post.id + 10}`);

    expect(response.status).toBe(404);
  });
});

describe('POST /post', () => {
  it('an authenticaded user should be able to make a post', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });

    const response = await request(app)
      .post('/post')
      .send({ title: 'test', content: 'testcontent' })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(201);
  });
  it('an post should have the authenticaded user id', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });

    const response = await request(app)
      .post('/post')
      .send({ title: 'test', content: 'testcontent' })
      .set('Authorization', `Bearer ${user.generateToken()}`);
    expect(response.body.user_id).toBe(user.id);
  });
});

describe('PATCH /post', () => {
  it('an authenticaded user should be able to edit a post', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const response = await request(app)
      .patch(`/post/${post.id}`)
      .send({ title: 'New title' })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
  it('should return 404 when trying to edit a post that does not exists', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const response = await request(app)
      .patch(`/post/${post.id + 99}`)
      .send({ title: 'test', content: 'testcontent' })
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(404);
  });
});

describe('DELETE /post', () => {
  it('an authenticaded user should be able to delete a post', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const response = await request(app)
      .delete(`/post/${post.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);
    
      expect(response.status).toBe(200);
  });
  it('should return 404 when trying to delete a post that does not exists', async () => {
    const user = await factory.create('User', {
      isAdmin: true,
    });
    const post = await factory.create('Post', {
      user_id: user.id,
    });

    const response = await request(app)
      .patch(`/post/${post.id + 99}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);
    expect(response.status).toBe(404);
  });
});
