const expenseRepository = require('../repositories/expenseRepository');
const PosError=require('../utils/posError')

const expenseService = {
  getAllExpenses: async (search, limit, offset) => {
    const expenses= await expenseRepository.findAllExpenses(search, limit, offset);
    return expenses;
  },

  getExpenseById: async (id) => {
   const expense= await expenseRepository.findExpenseById(id);
   if(!expense)
   {
    throw new PosError('Expense details not found',404)
   }
   return expense;
  },

  createExpense: async (expenseData) => {
    const { name, amount, category, description, recordedBy } = expenseData;
    
    return await expenseRepository.createExpense({
      name,
      amount,
      category,
      description,
      recordedBy
    });
  },

  updateExpense: async (id, expenseData) => {
    const { name, amount, category, description } = expenseData;
    
    const updated = await expenseRepository.updateExpense(id, {
      name,
      amount,
      category,
      description
    });

    return !!updated;
  },

  deleteExpense: async (id) => {
    const deleted = await expenseRepository.deleteExpense(id);
    return !!deleted;
  },

  getTotalExpensesAmount: async (userId = null, startDate = null, endDate = null) => {
    return await expenseRepository.getTotalExpensesAmount(userId, startDate, endDate);
  },

  getTotalExpensesCount: async (search = null) => {
    return await expenseRepository.countExpenses(search);
  }
};

module.exports = expenseService;