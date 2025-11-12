const saleService = require('../services/saleService');
const asyncHandler=require('../middlewares/asyncHandler');

const saleController = {
  getAllSales: asyncHandler(async (req, res) => {
      const { search='', start_date='', end_date='', limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const sales = await saleService.getAllSales(search, start_date, end_date, parseInt(limit), offset);
      const total = await saleService.getTotalSalesCount(search, start_date, end_date);
      
      res.status(200).json({ sales, total });
  }),

  getCashierSales: asyncHandler(async (req, res) => {
      const { search, start_date, end_date, limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const sales = await saleService.getCashierSales(
        req.user.id, 
        search, 
        start_date, 
        end_date, 
        parseInt(limit), 
        offset
      );
      
      const total = await saleService.getTotalSalesCount(search, start_date, end_date, req.user.id);
      
      res.status(200).json({
        success: true,
        sales,
        total,
        message: sales.length > 0 ? 'Sales retrieved successfully' : 'No sales found'
      });
  }),

  getTotalSalesToday: asyncHandler(async (req, res) => {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(startDate + 'T23:59:59.999Z');
      
      const totalSales = await saleService.getTotalSales(startDate, endDate, req.user.id);
      
      res.status(200).json({ 
        success: true, 
        total_sales: totalSales.toFixed(2) 
      });
  }),

  getSaleById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const sale = await saleService.getSaleById(id);
      
      res.status(200).json(sale);
  }),

  createSale: asyncHandler(async (req, res) => {
      const { items, paymentMethod, totalPrice} = req.body;
      const result = await saleService.createSale(req.user._id, items, paymentMethod, totalPrice);
      
      res.status(201).json(result);
  }),

  deleteSale: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await saleService.deleteSale(id);
      
      res.status(200).json(result);
  }),

  getSaleDetails: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const sale = await saleService.getSaleDetails(id);
         
      res.status(200).json(sale);
  })
};

module.exports = saleController;