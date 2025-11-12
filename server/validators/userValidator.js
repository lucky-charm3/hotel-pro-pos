const Joi = require('joi');

const createUserValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  role: Joi.string().valid('cashier', 'manager', 'admin').required(),
  password: Joi.string().min(6).required()
});

const updateUserValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  role: Joi.string().valid('cashier', 'manager', 'admin').optional()
});

module.exports = {
  createUserValidator,
  updateUserValidator
};