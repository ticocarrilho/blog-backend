const express = require('express');
const UserController = require('./app/controllers/UserController');
const PostController = require('./app/controllers/PostController');
const CommentaryController = require('./app/controllers/CommentaryController');
const { auth, isAdmin } = require('./middleware/auth');

const routes = express.Router();

routes.get('/api/user', UserController.index);
routes.get('/api/user/:userId', UserController.show);
routes.post('/api/user', UserController.store);
routes.patch('/api/user/:userId', auth, isAdmin, UserController.update);
routes.delete('/api/user/:userId', auth, isAdmin, UserController.delete);
routes.post('/api/user/login', UserController.login);

routes.get('/api/post', PostController.index);
routes.get('/api/post/:postId', PostController.show);
routes.post('/api/post', auth, isAdmin, PostController.store);
routes.patch('/api/post/:postId', auth, isAdmin, PostController.update);
routes.delete('/api/post/:postId', auth, isAdmin, PostController.delete);

routes.post('/api/post/:postId/comment', auth, CommentaryController.store);
routes.get('/api/post/:postId/comment', CommentaryController.index);
routes.patch('/api/post/comment/:commentId', auth, CommentaryController.update);
routes.delete(
  '/api/post/comment/:commentId',
  auth,
  CommentaryController.delete
);

routes.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = routes;
