const User = require('../models/User');
const bcrypt = require('bcrypt');
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
    const { name, email, isAdmin } = await User.findByPk(userId);
    return res.json({ name, email, isAdmin });
  },
  async store(req, res) {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail already in use' });
    }
    const user = await User.create({ name, email, password, isAdmin: false });
    return res.json(user);
  },
  async update(req, res) {
    //!TODO
    const { userId } = req.params;
    const { name, email, password, isAdmin } = req.body;
    const user = await User.update(
      { name, email, password, isAdmin },
      { where: { id: userId } }
    );
    return res.json(user);
  },
  async delete(req, res) {
    //!!TODO
    const { userId } = req.params;
    const user = await User.destroy({ where: { id: userId } });
    return res.json(user);
  },
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Wrong e-mail or password.' });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ error: 'Wrong e-mail or password.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 600,
    });
    return res.json({ token });
  },
};
