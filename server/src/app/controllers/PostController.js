const { Post } = require('../models');
module.exports = {
  async index(req, res) {
    const posts = await Post.findAll({
      include: [{ association: 'post_owner', attributes: ['name'] }],
    });
    return res.json(posts);
  },
  async show(req, res) {
    const { postId } = req.params;
    try {
      const post = await Post.findByPk(postId, {
        include: [{ association: 'post_commentary' }],
      });
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },
  async store(req, res) {
    const userId = req.user;
    const { title, content } = req.body;
    try {
      const post = await Post.create({ title, content, user_id: userId });
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },
  async update(req, res) {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
      const post = await Post.findOne({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      await post.update({ title, content });
      return res.json({ message: 'Post edited successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to edit post.' });
    }
  },
  async delete(req, res) {
    const { postId } = req.params;

    try {
      const post = await Post.findOne({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      await post.destroy();
      return res.json({ message: 'Commentary deleted successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to delete commentary.' });
    }
  },
};
