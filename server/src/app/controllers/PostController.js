const { Post } = require('../models');
module.exports = {
  async index(req, res) {
    const posts = await Post.findAll();
    return res.json(posts);
  },
  async show(req, res) {
    const { postId } = req.params;
    const post = await Post.findByPk(postId, {
      include: [{ association: 'post_commentary' }],
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
    return res.status(201).json(post);
  },
  async update(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    try {
      await post.update({ title, content });
      return res.json({ message: 'Post edited successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to edit post.' });
    }
  },
  async delete(req, res) {
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    try {
      await post.destroy();
      return res.json({ message: 'Commentary deleted successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to delete commentary.' });
    }
  },
};
