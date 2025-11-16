const userService=require('../services/userService');
const productService=require('../services/productService');
const expenseService=require('../services/expenseService')
const saleService=require('../services/saleService');
const bankingService=require('../services/bankingService');
const asyncHandler=require('../middlewares/asyncHandler');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const { start_date, end_date, month_start } = req.query;
  
  const today = new Date().toISOString().split('T')[0];
  const weekStart = start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthStart = month_start || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [
    salesToday,
    salesWeek,
    salesMonth,
    expensesToday,
    expensesWeek, 
    expensesMonth,
    totalProducts,
    totalUsers,
    bankingSummary
  ] = await Promise.all([
    saleService.getTotalSalesAmount(today, today, req.user.role === 'cashier' ? req.user._id : null),
    saleService.getTotalSalesAmount(weekStart, today, req.user.role === 'cashier' ? req.user._id : null),
    saleService.getTotalSalesAmount(monthStart, today, req.user.role === 'cashier' ? req.user._id : null),
    
    expenseService.getTotalExpensesAmount(req.user.role === 'cashier' ? req.user._id : null, today, today),
    expenseService.getTotalExpensesAmount(req.user.role === 'cashier' ? req.user._id : null, weekStart, today),
    expenseService.getTotalExpensesAmount(req.user.role === 'cashier' ? req.user._id : null, monthStart, today),
    
    productService.getTotalProducts(),
    userService.getTotalUsersCount(),
    bankingService.getBankingSummary(weekStart, today)
  ]);

  res.status(200).json({
    sales: {
      today: salesToday,
      week: salesWeek,
      month: salesMonth
    },
    expenses: {
      today: expensesToday,
      week: expensesWeek,
      month: expensesMonth
    },
    products: totalProducts,
    users: totalUsers,
    banking: bankingSummary,
    netIncome: {
      today: salesToday - expensesToday,
      week: salesWeek - expensesWeek,
      month: salesMonth - expensesMonth
    }
  });
});

module.exports=getDashboardSummary