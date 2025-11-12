const Joi = require('joi');

const createProductValidator = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  barcode: Joi.string().min(3).max(50).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().valid('food', 'drinks', 'services', 'others').required()
});

const updateProductValidator = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  barcode: Joi.string().min(3).max(50).required(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  category: Joi.string().valid('food', 'drinks', 'services', 'others').optional()
});

module.exports = {
  createProductValidator,
  updateProductValidator
};