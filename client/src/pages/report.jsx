import { useParams } from 'react-router-dom';
import { useGetReportById } from '../hooks/reportQuery';
import Button from '../UI/button.jsx';

const ReportCell = ({ value, type }) => {
  if (value === null || value === undefined) return '-';
  
  if (['totalPrice', 'amount', 'price', 'totalAmount'].includes(type) && typeof value === 'number') {
    return `Tshs ${value.toFixed(2)}`;
  }
  
  // Format dates
  if (type === 'createdAt' || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    return new Date(value).toLocaleString();
  }
  
  // Handle objects/arrays
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
};

// Summary statistics component
const ReportSummary = ({ report }) => {
  const { content, type } = report;
  
  if (!content || content.length === 0) return null;

  const getSummaryStats = () => {
    switch (type) {
      case 'sales':
        const totalSales = content.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
        const totalTransactions = content.length;
        const paymentMethods = content.reduce((acc, item) => {
          const method = item.paymentMethod || 'Unknown';
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {});
        
        return [
          { label: 'Total Sales', value: `Tshs ${totalSales.toFixed(2)}`, color: 'text-green-600' },
          { label: 'Total Transactions', value: totalTransactions.toLocaleString(), color: 'text-blue-600' },
          { label: 'Average Sale', value: `Tshs ${(totalSales / totalTransactions).toFixed(2)}`, color: 'text-purple-600' },
          { label: 'Payment Methods', value: Object.keys(paymentMethods).length, color: 'text-orange-600' }
        ];
      
      case 'expenses':
        const totalExpenses = content.reduce((sum, item) => sum + (item.amount || 0), 0);
        const categories = [...new Set(content.map(item => item.category).filter(Boolean))];
        
        return [
          { label: 'Total Expenses', value: `Tshs ${totalExpenses.toFixed(2)}`, color: 'text-red-600' },
          { label: 'Expense Items', value: content.length.toLocaleString(), color: 'text-orange-600' },
          { label: 'Categories', value: categories.length, color: 'text-purple-600' }
        ];
      
      case 'banking':
        const deposits = content.filter(item => item.type === 'deposit').reduce((sum, item) => sum + (item.amount || 0), 0);
        const withdrawals = content.filter(item => item.type === 'withdrawal').reduce((sum, item) => sum + (item.amount || 0), 0);
        const netFlow = deposits - withdrawals;
        
        return [
          { label: 'Total Deposits', value: `Tshs ${deposits.toFixed(2)}`, color: 'text-green-600' },
          { label: 'Total Withdrawals', value: `Tshs ${withdrawals.toFixed(2)}`, color: 'text-red-600' },
          { label: 'Net Flow', value: `Tshs ${netFlow.toFixed(2)}`, color: netFlow >= 0 ? 'text-blue-600' : 'text-red-600' }
        ];
      
      case 'products':
        const totalProducts = content.length;
        const lowStock = content.filter(item => (item.stock || 0) <= 10).length;
        const outOfStock = content.filter(item => (item.stock || 0) === 0).length;
        
        return [
          { label: 'Total Products', value: totalProducts.toLocaleString(), color: 'text-blue-600' },
          { label: 'Low Stock (≤10)', value: lowStock.toLocaleString(), color: 'text-orange-600' },
          { label: 'Out of Stock', value: outOfStock.toLocaleString(), color: 'text-red-600' }
        ];
      
      default:
        return [
          { label: 'Total Records', value: content.length.toLocaleString(), color: 'text-gray-600' }
        ];
    }
  };

  const stats = getSummaryStats();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border">
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mt-1 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data table component
const ReportDataTable = ({ data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-lg">No data available for this report</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  
  const friendlyHeaders = {
    '_id': 'ID',
    'cashier': 'Cashier',
    'totalPrice': 'Total Price',
    'totalAmount': 'Total Amount',
    'amount': 'Amount',
    'price': 'Price',
    'quantity': 'Quantity',
    'qty': 'Quantity',
    'paymentMethod': 'Payment Method',
    'category': 'Category',
    'type': 'Type',
    'createdAt': 'Date',
    'description': 'Description',
    'username': 'Username',
    'product': 'Product',
    'name': 'Name',
    'stock': 'Stock',
    'barcode': 'Barcode',
    'reference': 'Reference',
    'performedBy': 'Performed By',
    'recordedBy': 'Recorded By'
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(header => (
              <th 
                key={header} 
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              >
                {friendlyHeaders[header] || header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={row._id || index} className="hover:bg-gray-50 transition-colors">
              {headers.map(header => (
                <td 
                  key={header} 
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-b"
                >
                  <ReportCell value={row[header]} type={header} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Report component
export default function Report() {
  const { id } = useParams();
  const { data: report, isLoading, error } = useGetReportById(id);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='h-12 w-12 rounded-full border-4 border-t-primary-dark border-primary-light animate-spin'></div>
        <p className='mt-4 text-gray-600'>Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
        <p className='text-red-600'>Failed to load report: {error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>Report not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Report Header */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {report.title || `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report`}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <span><strong>Period:</strong> {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</span>
              <span><strong>Generated:</strong> {new Date(report.createdAt).toLocaleString()}</span>
              <span><strong>By:</strong> {report.generatedBy?.username || 'System'}</span>
              <span><strong>Type:</strong> <span className="capitalize">{report.type}</span></span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => window.open(`/mainRoute/reportsManagement/${id}/print`, '_blank')}
              color1='primary' 
              color2='primary-dark'
              className="text-sm"
            >
              Print Report
            </Button>
            <Button 
              onClick={() => {/* Add CSV download functionality */}}
              color1='secondary' 
              color2='secondary-dark'
              className="text-sm"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6">
        <ReportSummary report={report} />
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Detailed Data</h3>
          <p className="text-sm text-gray-600">
            Showing {report.content?.length || 0} records
          </p>
        </div>

        <ReportDataTable data={report.content} type={report.type} />
      </div>
    </div>
  );
}