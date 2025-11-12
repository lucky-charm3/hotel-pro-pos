const Joi = require('joi');

const createSaleValidator = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().hex().length(24).required(),
      productName: Joi.string().min(2).max(100).required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'mobile', 'transfer').required(),
  totalPrice: Joi.number().min(0).required()
});

const updateSaleValidator = Joi.object({
  status: Joi.string().valid('completed', 'refunded', 'cancelled').optional()
});

module.exports = {
  createSaleValidator,
  updateSaleValidator
};