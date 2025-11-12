const Joi = require('joi');

const createReportValidator = Joi.object({
  type: Joi.string().valid('sales', 'products', 'expenses', 'banking', 'comprehensive').required(),
  dateRange: Joi.string().valid('today', 'week', 'month', 'quarter', 'year').required(),
  filters: Joi.object().optional()
});

module.exports = {
  createReportValidator
};