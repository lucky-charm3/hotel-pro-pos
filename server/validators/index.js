
const { createUserValidator, updateUserValidator } = require('./userValidator');
const { createProductValidator, updateProductValidator } = require('./productValidator');
const { createSaleValidator, updateSaleValidator } = require('./saleValidator');
const { createExpenseValidator, updateExpenseValidator } = require('./expenseValidator');
const { createBankingValidator, updateBankingValidator } = require('./bankingValidator');
const { createReportValidator } = require('./reportValidator');
const { loginValidator, changePasswordValidator } = require('./authValidator.js');

module.exports = {
  createUserValidator,
  updateUserValidator,
  createProductValidator,
  updateProductValidator,
  createSaleValidator,
  updateSaleValidator,
  createExpenseValidator,
  updateExpenseValidator,
  createBankingValidator,
  updateBankingValidator,
  createReportValidator,
  loginValidator,
  changePasswordValidator
};