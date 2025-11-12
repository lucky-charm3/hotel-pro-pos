const Report = require('../models/reportModel');

const reportRepository = {
  findAllReports: async (limit = 10) => {
    return await Report.find()
      .populate('generatedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  findReportById: async (id) => {
    return await Report.findById(id)
      .populate('generatedBy', 'username email phone');
  },

  createReport: async (reportData) => {
    const report = new Report(reportData);
    return await report.save();
  },

  deleteReport: async (id) => {
    return await Report.findByIdAndDelete(id);
  }
};

module.exports = reportRepository;