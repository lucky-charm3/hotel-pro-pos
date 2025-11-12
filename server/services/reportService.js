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

  printReportHTML: async (id, res) => {
    const report = await reportRepository.findReportById(id).populate('generatedBy', 'username');
    
    if (!report) {
      return res.status(404).send('<h2>Report not found</h2>');
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

    const html = generateHTMLReport(report, friendlyHeaders);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
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


function generateHTMLReport(report, friendlyHeaders) {
  const data = report.content || [];
  const type = report.type.charAt(0).toUpperCase() + report.type.slice(1);
  
  let totalAmount = 0;
  if (report.type === 'sales') {
    totalAmount = data.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  } else if (report.type === 'expenses') {
    totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  return `
<!DOCTYPE html>
<html>
<head>
    <title>${type} Report</title>
    <style>
        @media print {
            body { 
                font-family: 'Arial', sans-serif; 
                font-size: 12px; 
                margin: 0;
                padding: 15px;
                color: 
                background: 
            }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0;
                font-size: 11px;
            }
            th, td { 
                border: 1px solid 
                padding: 6px; 
                text-align: left;
                page-break-inside: avoid;
            }
            th { 
                background-color: 
                font-weight: bold;
            }
            .report-header { 
                text-align: center; 
                margin-bottom: 20px;
                border-bottom: 2px solid 
                padding-bottom: 10px;
            }
            .report-footer { 
                margin-top: 30px;
                text-align: center;
                font-size: 10px;
                color: 
            }
            .summary { 
                margin: 15px 0;
                padding: 10px;
                background-color: 
                border-left: 4px solid 
            }
        }
        @media screen {
            body { 
                font-family: 'Arial', sans-serif; 
                font-size: 14px; 
                padding: 20px;
                background-color: 
            }
            .print-container { 
                background: white; 
                padding: 30px; 
                border: 1px solid 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-width: 1000px;
                margin: 0 auto;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0;
            }
            th, td { 
                border: 1px solid 
                padding: 8px; 
                text-align: left;
            }
            th { 
                background-color: 
                color: white;
            }
            tr:nth-child(even) { background-color: 
            .report-header { 
                text-align: center; 
                margin-bottom: 30px;
                color: 
            }
            .summary { 
                margin: 20px 0;
                padding: 15px;
                background-color: 
                border-radius: 5px;
            }
            .btn-container { 
                margin: 20px 0; 
                text-align: center;
            }
            button { 
                padding: 10px 20px; 
                margin: 0 10px; 
                background: 
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover { background: 
        }
    </style>
</head>
<body>
    <div class="print-container">
        <div class="report-header">
            <h1>${type} Report</h1>
            <p><strong>Business Name:</strong> POS System</p>
            <p><strong>Report Period:</strong> ${new Date(report.startDate).toLocaleDateString()} to ${new Date(report.endDate).toLocaleDateString()}</p>
            <p><strong>Generated On:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
            <p><strong>Generated By:</strong> ${report.generatedBy?.username || 'System'}</p>
        </div>

        ${data.length > 0 ? `
            <div class="summary">
                <h3>Report Summary</h3>
                <p><strong>Total Records:</strong> ${data.length.toLocaleString()}</p>
                ${totalAmount > 0 ? `<p><strong>Total ${report.type === 'sales' ? 'Sales' : 'Expenses'}:</strong> Tshs ${totalAmount.toFixed(2)}</p>` : ''}
            </div>

            <table>
                <thead>
                    <tr>
                        ${Object.keys(data[0]).map(key => `
                            <th>${friendlyHeaders[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${Object.keys(row).map(key => `
                                <td>
                                    ${['totalPrice', 'amount', 'price'].includes(key) && typeof row[key] === 'number' ? 
                                        `Tshs ${row[key].toFixed(2)}` : 
                                        key === 'createdAt' ? 
                                        new Date(row[key]).toLocaleString() :
                                        typeof row[key] === 'object' ?
                                        JSON.stringify(row[key]) :
                                        row[key]
                                    }
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="alert">
                <p>No data available for this report.</p>
            </div>
        `}

        <div class="report-footer">
            <p>Generated on ${new Date().toLocaleString()} | Page 1 of 1</p>
        </div>

        <div class="btn-container no-print">
            <button onclick="window.print()">Print Report</button>
            <button onclick="window.close()">Close Window</button>
        </div>
    </div>

    <script>
        window.onload = function() {
            
            
        };
    </script>
</body>
</html>`;
}

module.exports = reportService;