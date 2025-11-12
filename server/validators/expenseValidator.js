const Joi = require('joi');

const createExpenseValidator = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  amount: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(200).optional()
});

const updateExpenseValidator = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  amount: Joi.number().min(0).optional(),
  category: Joi.string().min(2).max(50).optional(),
  description: Joi.string().max(200).optional()
});

module.exports = {
  createExpenseValidator,
  updateExpenseValidator
};