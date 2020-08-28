const { User } = require('../models');
const jwt = require('jsonwebtoken');

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
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { id, name, email, isAdmin } = user;
    return res.json({ id, name, email, isAdmin });
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
    return res.status(201).json({ token });
  },
  async update(req, res) {
    const { userId } = req.params;
    const { name, email, password, isAdmin } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    try {
      await user.update({ name, email, password, isAdmin });
      return res.json({ message: 'User edited successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to edit user.' });
    }
  },
  async delete(req, res) {
    const { userId } = req.params;
    const user = await User.findOne({ where: { id: userId } });
    try {
      await user.destroy();

      return res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      return res.status(400).json({ error: 'Unable to delete user' });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Wrong e-mail or password.' });
    }

    return res.json({ token: user.generateToken() });
  },
};
