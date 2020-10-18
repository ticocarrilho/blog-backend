const { body } = require('express-validator');

const NAME_EMPTY = 'The name field cannot be empty.';
const EMAIL_EMPTY = 'The e-mail field cannot be empty.';
const EMAIL_INVALID = 'Insert a valid e-mail.';
const PASSWORD_MIN = 'The password must have more than 8 characters.';
const PASSWORD_EMPTY = 'The password field cannot be empty.';

module.exports = {
  userRequiredFieldsPost: [
    body('name').trim().notEmpty().withMessage(NAME_EMPTY),
    body('email')
      .trim()
      .notEmpty()
      .withMessage(EMAIL_EMPTY)
      .bail()
      .isEmail()
      .withMessage(EMAIL_INVALID),
    body('password')
      .trim()
      .notEmpty()
      .withMessage(PASSWORD_EMPTY)
      .bail()
      .isLength({ min: 8 })
      .withMessage(PASSWORD_MIN),
  ],
  userRequiredFieldsPatch: [
    body('name').optional().trim().notEmpty().withMessage(NAME_EMPTY),
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage(EMAIL_EMPTY)
      .bail()
      .isEmail()
      .withMessage(EMAIL_INVALID),
    body('password')
      .optional()
      .trim()
      .notEmpty()
      .withMessage(PASSWORD_EMPTY)
      .bail()
      .isLength({ min: 8 })
      .withMessage(PASSWORD_MIN),
  ],
  userLoginRequiredFields: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage(EMAIL_EMPTY)
      .bail()
      .isEmail()
      .withMessage(EMAIL_INVALID),
    body('password')
      .notEmpty()
      .withMessage(PASSWORD_EMPTY)
      .bail()
      .isLength({ min: 8 })
      .withMessage(PASSWORD_MIN),
  ],
};
