const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  async auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: 'Unauthorized!',
          });
        }
        req.user = decoded.id;
        next();
      });
    }
    return res.status(401);
  },
  async isAdmin(req, res, next) {
    const userId = req.user;
    const user = await User.findByPk(userId);
    if (!user.isAdmin) {
      return res.status(401).json({
        error: 'Unauthorized!',
      });
    }
    next();
  },
};
