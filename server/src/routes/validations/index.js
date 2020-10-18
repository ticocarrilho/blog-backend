const { validationResult } = require('express-validator');
const { userRequiredFieldsPost, userRequiredFieldsPatch, userLoginRequiredFields } = require('./userValidations');

module.exports = {
  userRequiredFieldsPost,
  userRequiredFieldsPatch,
  userLoginRequiredFields,
  async returnValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
};
