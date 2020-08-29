const jwt = require('jsonwebtoken');
const { User } = require('../app/models');

module.exports = {
  async auth(req, res, next) {
    const token = req.signedCookies.token;
    if (!token) {
      return res.status(401).json({
        error: 'Token not provided!',
      });
    }
    let id;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Unauthorized!',
        });
      }
      id = decoded.id;
    });
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exists.' });
    }
    req.user = id;
    return next();
  },
  async isAdmin(req, res, next) {
    const userId = req.user;
    const user = await User.findByPk(userId);
    if (!user.isAdmin) {
      return res.status(401).json({
        error: 'You are not an admin!',
      });
    }
    next();
  },
};
