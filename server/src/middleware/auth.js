const jwt = require('jsonwebtoken');
const { User } = require('../app/models');

module.exports = {
  async auth(req, res, next) {
    if (req.cookies.session == 1) {
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
      try {
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ error: 'User does not exists.' });
        }
        req.user = id;
        return next();
      } catch (error) {
        return res.status(500).json({ message: 'Server error.' });
      }
    } else {
      return res.status(401).json({
        error: 'Unauthorized!',
      });
    }
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
