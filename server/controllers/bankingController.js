const bankingService = require('../services/bankingService');
const asyncHandler=require('../middlewares/asyncHandler');

const bankingController = {
  getAllBanking: asyncHandler(async (req, res) => {
      const { search, limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const banking = await bankingService.getAllBanking(search, parseInt(limit), offset);
      const total = await bankingService.getTotalBankingCount(search);
      
      res.status(200).json({
        banking, 
        total ,
        totalPages:Math.ceil(total/limit)});
  }),

  getBankingById:asyncHandler(async (req, res) => {
      const { id } = req.params;
      const record = await bankingService.getBankingById(id);
      res.status(200).json(record);
  }),

  createBanking: asyncHandler(async (req, res) => {
      const { type, amount, description, reference } = req.body;
      const result = await bankingService.createBanking({
        type,
        amount,
        description,
        reference,
        performedBy: req.user.id
      });
      
      res.status(201).json({ success: true, id: result._id });
  }),

  updateBanking: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { type, amount, description, reference } = req.body;
      
      const result = await bankingService.updateBanking(id, {
        type,
        amount,
        description,
        reference
      });
      
      res.status(200).json({ success: result });
  }),

  deleteBanking: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await bankingService.deleteBanking(id);
      
      res.status(200).json({ success: result });
  }),

  getBankingSummary: asyncHandler(async (req, res) => {
      const { start_date, end_date } = req.query;
      const summary = await bankingService.getBankingSummary(start_date, end_date);
      
      res.status(200).json(summary);
  })

  
};

module.exports = bankingController;