const User = require('../models/User');
const Post = require('../models/Post');
module.exports = {
  async index(req, res) {
    const posts = await Post.findAll();
    return res.json(posts);
  },
  async show(req, res) {
    const { postId } = req.params;
    const post = await Post.findByPk(postId);
    return res.json(post);
  },
  async store(req, res) {
    const userId = req.user;
    const { title, content } = req.body;
    const user = User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }
    const post = await Post.create({ title, content, user_id: userId });
    return res.json(post);
  },
  async update(req, res) {
    //!TODO
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.update(
      { title, content },
      { where: { id: postId } }
    );
    return res.json(post);
  },
  async delete(req, res) {
    //!!TODO
    const { postId } = req.params;
    const post = await Post.destroy({ where: { id: postId } });
    return res.json(post);
  },
};
