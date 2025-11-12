const expenseService = require('../services/expenseService');
const asyncHandler=require('../middlewares/asyncHandler');

const expenseController = {
  getAllExpenses: asyncHandler(async (req, res) => {
      const { search, limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const expenses = await expenseService.getAllExpenses(search, parseInt(limit), offset);
      const total = await expenseService.getTotalExpensesCount(search);
      
      res.status(200).json({ 
        expenses, 
        total ,
        totalPages:Math.ceil(total/limit)
      });
  }),

  getExpenseById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(id);
      res.status(200).json(expense);
  }),

  createExpense: asyncHandler(async (req, res) => {
      const { name, amount, category, description } = req.body;
      const result = await expenseService.createExpense({
        name,
        amount,
        category,
        description,
        recordedBy: req.user.id
      });
      
      res.status(201).json({ success: true, id: result._id });
  }),

  updateExpense: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { name, amount, category, description } = req.body;
      
      const result = await expenseService.updateExpense(id, {
        name,
        amount,
        category,
        description
      });
      
      res.status(200).json({ success: result });
  }),

  deleteExpense: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await expenseService.deleteExpense(id);
      
      res.status(200).json({ success: result });
  }),

  getTotalExpenses: asyncHandler(async (req, res) => {
      const { start_date, end_date } = req.query;
      const total = await expenseService.getTotalExpensesAmount(req.user.id, start_date, end_date);
      
      res.status(200).json({ total_expenses: total });
  })
};

module.exports = expenseController;