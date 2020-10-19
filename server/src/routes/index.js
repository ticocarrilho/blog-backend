const express = require('express');
const UserController = require('../app/controllers/UserController');
const PostController = require('../app/controllers/PostController');
const CommentaryController = require('../app/controllers/CommentaryController');
const { auth, isAdmin } = require('../middleware/auth');
const {
  userRequiredFieldsPost,
  userRequiredFieldsPatch,
  userLoginRequiredFields,
  returnValidation,
} = require('./validations');

const routes = express.Router();

routes.get('/api/user', UserController.index);
routes.get('/api/user/:userId', UserController.show);
routes.post(
  '/api/user',
  userRequiredFieldsPost,
  returnValidation,
  UserController.store
);
routes.patch(
  '/api/user/:userId',
  userRequiredFieldsPatch,
  returnValidation,
  auth,
  isAdmin,
  UserController.update
);
routes.delete('/api/user/:userId', auth, isAdmin, UserController.delete);
routes.post(
  '/api/user/login',
  userLoginRequiredFields,
  returnValidation,
  UserController.login
);
routes.get('/api/me', auth, UserController.me);
routes.post('/api/logout', UserController.logout);

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
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.end();
});

module.exports = routes;
