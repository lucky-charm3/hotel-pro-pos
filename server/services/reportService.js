const reportRepository = require('../repositories/reportRepository');
const saleRepository = require('../repositories/saleRepository');
const expenseRepository = require('../repositories/expenseRepository');
const bankingRepository = require('../repositories/bankingRepository');
const productRepository = require('../repositories/productRepository');

const reportService = {
  generateReport: async (type, dateRange, generatedBy, filters = {}) => {
    const dates = getDateRange(dateRange);
    const startDate = dates.start;
    const endDate = dates.end;

    let data;
    
    switch (type) {
      case 'sales':
        data = await saleRepository.findAllSales(null, startDate, endDate, null, 0);
        break;
        
      case 'expenses':
        data = await expenseRepository.findAllExpenses(null, null, 0);
        if (startDate && endDate) {
          data = data.filter(expense => 
            expense.createdAt >= new Date(startDate) && 
            expense.createdAt <= new Date(endDate)
          );
        }
        break;
        
      case 'banking':
        data = await bankingRepository.findAllBanking(null, null, 0);
        if (startDate && endDate) {
          data = data.filter(transaction => 
            transaction.createdAt >= new Date(startDate) && 
            transaction.createdAt <= new Date(endDate)
          );
        }
        break;
        
      case 'products':
        data = await productRepository.findAllProducts(null, null, 0);
        break;
        
      default:
        return { success: false, message: 'Invalid report type' };
    }

    const formattedData = data.map(item => item.toObject ? item.toObject() : item);

    const reportData = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      generatedBy,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      content: formattedData,
      filters,
      isGenerated: true
    };

    const newReport = await reportRepository.createReport(reportData);
    
    return {
      success: true,
      report_id: newReport._id,
      data: formattedData,
      type,
      start_date: startDate,
      end_date: endDate
    };
  },

  getAllReports: async (limit) => {
    return await reportRepository.findAllReports(limit);
  },

  getReportById: async (id) => {
    return await reportRepository.findReportById(id);
  },

  deleteReport: async (id) => {
    const deleted = await reportRepository.deleteReport(id);
    if (!deleted) {
      return { success: false, message: 'Failed to delete report' };
    }
    
    return { success: true, message: 'Report deleted successfully' };
  },

  downloadReportCSV: async (id, res) => {
    const report = await reportRepository.findReportById(id);
    if (!report || !report.content) {
      return res.status(404).json({ success: false, message: 'Report not found or has no content' });
    }

    const friendlyHeaders = {
      '_id': 'ID',
      'cashier': 'Cashier',
      'totalPrice': 'Total Price',
      'items': 'Items',
      'name': 'Name',
      'product': 'Product',
      'user': 'User',
      'username': 'Username',
      'quantity': 'Quantity',
      'amount': 'Amount',
      'price': 'Price',
      'paymentMethod': 'Payment Method',
      'category': 'Category',
      'type': 'Type',
      'stock': 'Stock',
      'barcode': 'Barcode',
      'createdAt': 'Date',
      'performedBy': 'Performed By',
      'recordedBy': 'Recorded By'
    };

    const filename = `${report.type}_report_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0');
    res.setHeader('Expires', '0');
    res.setHeader('Pragma', 'public');

    
    res.write('\uFEFF');

    if (report.content && Array.isArray(report.content) && report.content.length > 0) {
      const headers = Object.keys(report.content[0]);
      const friendlyHeadersRow = headers.map(header => 
        friendlyHeaders[header] || header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')
      );
      
      res.write(friendlyHeadersRow.join(',') + '\n');

      report.content.forEach(row => {
        const formattedRow = headers.map(header => {
          let value = row[header];
          
          if (value === null || value === undefined) {
            return '';
          }
          
          if (typeof value === 'object') {
            return JSON.stringify(value).replace(/"/g, '""');
          }
          
          if (['totalPrice', 'amount', 'price'].includes(header)) {
            return parseFloat(value).toFixed(2);
          }
          
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        
        res.write(formattedRow.join(',') + '\n');
      });
    } else {
      res.write('No data available for this report.\n');
    }

    res.end();
  },

  // Backend - reportService.js (remove HTML generation)
printReportHTML: async (id, res) => {
  const report = await reportRepository.findReportById(id).populate('generatedBy', 'username');
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }
  
  // Return clean data, let frontend handle presentation
  res.json({
    success: true,
    report: {
      ...report.toObject(),
      generatedBy: report.generatedBy
    }
  });
}
};


function getDateRange(range) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  let start = new Date();

  switch (range) {
    case 'today':
      start = new Date(today);
      break;
    case 'week':
      start = new Date(today);
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(today.getMonth() / 3);
      start = new Date(today.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      start = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(today);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}


module.exports = reportService;