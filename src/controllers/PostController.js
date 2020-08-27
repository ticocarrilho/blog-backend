const User = require('../models/User');
const Post = require('../models/Post');
module.exports = {
  async index(req, res) {
    const posts = await Post.findAll();
    return res.json(posts);
  },
  async show(req, res) {
    const { postId } = req.params;
    const post = await Post.findByPk(postId, {
      include: [{ association: 'post_commentaries' }],
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    return res.json(post);
  },
  async store(req, res) {
    const userId = req.user;
    const { title, content } = req.body;
    const post = await Post.create({ title, content, user_id: userId });
    return res.json(post);
  },
  async update(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.findOne({ where: { id: postId } });
    post
      .update({ title, content })
      .then(() => {
        return res.status(201).json({ message: 'Post edited successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to edit post.' });
      });
    return res.json(post);
  },
  async delete(req, res) {
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    post
      .destroy()
      .then(() => {
        return res.json({ message: 'Commentary deleted successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to delete commentary.' });
      });
  },
};
