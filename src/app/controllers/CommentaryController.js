const { Post } = require('../models');
const { Commentary } = require('../models');
module.exports = {
  async index(req, res) {
    const { postId } = req.params;
    const comments = await Post.findByPk(postId, {
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
    return res.json(comments);
  },
  async store(req, res) {
    const { content } = req.body;
    const userId = req.user;
    const { postId } = req.params;
    console.log(userId);
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

    const commentary = await Commentary.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!commentary) {
      return res.status(404).json({ error: 'Commentary not found.' });
    }

    commentary
      .update({ content })
      .then(() => {
        return res
          .status(201)
          .json({ message: 'Commentary edited successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to edit commentary.' });
      });
  },
  async delete(req, res) {
    const userId = req.user;
    const { commentId } = req.params;

    const commentary = await Commentary.findOne({
      where: { id: commentId, user_id: userId },
    });

    if (!commentary) {
      return res.status(404).json({ error: 'Commentary not found.' });
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
