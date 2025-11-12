
const reportService = require('../services/reportService');
const asyncHandler=require('../middlewares/asyncHandler');

const reportController = {
  generateReport: asyncHandler(async (req, res) => {
      const { type, dateRange, filters } = req.body;
      const report = await reportService.generateReport(type, dateRange, req.user.id, filters);
      
      res.status(201).json(report);
  }),

  
  getAllReports: asyncHandler(async (req, res) => {
      const { limit = 10 } = req.query;
      const reports = await reportService.getAllReports(parseInt(limit));
      
      res.status(200).json({ success: true, reports,totalPages:Math.ceil(reports.length/limit) });
  }),

  
  getReportById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const report = await reportService.getReportById(id);
      
      res.status(200).json(report);
  }),

  
  deleteReport: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await reportService.deleteReport(id);
      
      res.status(200).json(result);
  }),

  
  downloadReportCSV: asyncHandler(async (req, res) => {
      const { id } = req.params;
      await reportService.downloadReportCSV(id, res);
  }),

  
  printReportHTML: asyncHandler(async (req, res) => {
      const { id } = req.params;
      await reportService.printReportHTML(id, res);
  })
};

module.exports = reportController;