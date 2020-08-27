const { User } = require('../models');

module.exports = {
  async index(req, res) {
    const allUsers = await User.findAll();
    const users = allUsers.map((user) => ({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    }));
    return res.json(users);
  },
  async show(req, res) {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (user) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    const { name, email, isAdmin } = user;
    return res.json({ name, email, isAdmin });
  },
  async store(req, res) {
    const { name, email, password } = req.body;
    const emailInUse = await User.findOne({ where: { email } });
    if (emailInUse) {
      return res.status(400).json({ error: 'E-mail already in use' });
    }
    const user = await User.create({ name, email, password, isAdmin: false });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
    return res.json({ token });
  },
  async update(req, res) {
    const { userId } = req.params;
    const { name, email, password, isAdmin } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    user
      .update({ name, email, password, isAdmin })
      .then(() => {
        return res.status(201).json({ message: 'User edited successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to edit user.' });
      });
  },
  async delete(req, res) {
    const { userId } = req.params;
    const user = await User.findOne({ where: { id: userId } });
    user
      .destroy()
      .then(() => {
        return res.json({ message: 'User deleted successfully.' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'Unable to delete user' });
      });
    return res.json(user);
  },
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Wrong e-mail or password.' });
    }

    return res.json({ token: user.generateToken() });
  },
};