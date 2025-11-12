const Joi = require('joi');

const createBankingValidator = Joi.object({
  type: Joi.string().valid('withdrawal', 'transfer', 'deposit').required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().max(200).optional(),
  reference: Joi.string().max(100).optional()
});

const updateBankingValidator = Joi.object({
  type: Joi.string().valid('withdrawal', 'transfer', 'deposit').optional(),
  amount: Joi.number().min(0).optional(),
  description: Joi.string().max(200).optional(),
  reference: Joi.string().max(100).optional()
});

module.exports = {
  createBankingValidator,
  updateBankingValidator
};