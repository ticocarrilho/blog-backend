const { Post } = require('../models');
const { Commentary } = require('../models');
module.exports = {
  async index(req, res) {
    const { postId } = req.params;
    const { post_commentary } = await Post.findByPk(postId, {
      include: [
        {
          association: 'post_commentary',
          include: {
            association: 'user_commentary',
            attributes: ['id', 'name'],
          },
        },
      ],
    });
    return res.json(post_commentary);
  },
  async store(req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const commentary = await Commentary.create({
      content,
      user_id: userId,
      post_id: postId,
    });
    return res.status(201).json(commentary);
  },
  async update(req, res) {
    const { content } = req.body;
    const userId = req.user;
    const { commentId } = req.params;

    const commentary = await Commentary.findByPk(commentId);

    if (!commentary) {
      return res.status(404).json({ error: 'Commentary not found.' });
    }

    if (commentary.user_id !== userId) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    commentary
      .update({ content })
      .then(() => {
        return res.json({ message: 'Commentary edited successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to edit commentary.' });
      });
  },
  async delete(req, res) {
    const userId = req.user;
    const { commentId } = req.params;

    const commentary = await Commentary.findByPk(commentId);

    if (!commentary) {
      return res.status(404).json({ error: 'Commentary not found.' });
    }

    if (commentary.user_id !== userId) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    commentary
      .destroy()
      .then(() => {
        return res.json({ message: 'Commentary deleted successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to delete commentary.' });
      });
  },
};
