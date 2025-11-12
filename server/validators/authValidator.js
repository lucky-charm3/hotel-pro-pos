const Joi = require('joi');

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  loginValidator,
  changePasswordValidator
};