const Expense = require('../models/expenseModel');

const expenseRepository = {
  findAllExpenses: async (search, limit = 10, offset = 0) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'recordedBy.username': { $regex: search, $options: 'i' } }
      ];
    }

    return await Expense.find(query)
      .populate('recordedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findExpenseById: async (id) => {
    return await Expense.findById(id)
      .populate('recordedBy', 'username email phone');
  },

  createExpense: async (expenseData) => {
    const expense = new Expense(expenseData);
    return await expense.save();
  },

  updateExpense: async (id, updateData) => {
    return await Expense.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
  },

  deleteExpense: async (id) => {
    return await Expense.findByIdAndDelete(id);
  },

  getTotalExpensesAmount: async (userId = null, startDate = null, endDate = null) => {
    let query = {};
    
    if (userId) {
      query.recordedBy = userId;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const result = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  },

  countExpenses: async (search = null) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { 'recordedBy.username': { $regex: search, $options: 'i' } }
      ];
    }

    return await Expense.countDocuments(query);
  }
};

module.exports = expenseRepository;