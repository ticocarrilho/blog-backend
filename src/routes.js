const express = require('express');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const CommentaryController = require('./controllers/CommentaryController');
const { auth, isAdmin } = require('./middleware/auth');

const routes = express.Router();

routes.get('/user', UserController.index);
routes.get('/user/:userId', UserController.show);
routes.post('/user', UserController.store);
routes.patch('/user/:userId', auth, isAdmin, UserController.update);
routes.delete('/user/:userId', auth, isAdmin, UserController.delete);
routes.post('/user/login', UserController.login);

routes.get('/post', PostController.index);
routes.get('/post/:postId', PostController.show);
routes.post('/post', auth, isAdmin, PostController.store);
routes.patch('/post/:postId', auth, isAdmin, PostController.update);
routes.delete('/post/:postId', auth, isAdmin, PostController.delete);

routes.post('/post/:postId/comment', auth, CommentaryController.store);
routes.get('/post/:postId/comment', CommentaryController.index);
routes.patch('/post/comment/:commentId', auth, CommentaryController.update);
routes.delete('/post/comment/:commentId', auth, CommentaryController.delete);

module.exports = routes;
