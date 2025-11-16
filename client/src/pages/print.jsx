import { useEffect } from "react";
import {useParams} from 'react-router-dom';
import {useGetSaleById} from '../hooks/saleQuery.js';
import {useGetReportById} from '../hooks/reportQuery.js';

function PrintSale() {
  const { id } = useParams();
  const { data: sale } = useGetSaleById(id);

  useEffect(() => {
    if (!sale) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sale Receipt</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            font-size: 14px; 
            margin: 20px;
            max-width: 300px;
          }
          .header { text-align: center; margin-bottom: 15px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 4px 2px; text-align: left; }
          .total { font-weight: bold; border-top: 2px solid #000; }
          .thank-you { text-align: center; margin-top: 20px; font-style: italic; }
          @media print { 
            body { margin: 0; } 
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>NEW DF HOTEL</h2>
          <p>Sale Receipt</p>
        </div>
        
        <p><strong>Staff(Created By):</strong> ${sale?.createdBy?.username || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(sale?.createdAt).toLocaleString()}</p>
        <p><strong>Receipt #:</strong> ${sale._id}</p>
        
        <div class="divider"></div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale?.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>Tshs ${item.price?.toFixed(2)}</td>
                <td>Tshs ${item.subtotal?.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="3">TOTAL</td>
              <td>Tshs ${sale.totalAmount?.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        ${sale.paymentMethod ? `<p><strong>Payment:</strong> ${sale.paymentMethod}</p>` : ''}
        
        <div class="thank-you">
          <p>Thank you for your business!</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px; margin: 10px;">Print Receipt</button>
          <button onclick="window.close()" style="padding: 10px; margin: 10px;">Close</button>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
  }, [sale, id]);

  return <div>Loading receipt...</div>;
}

// components/Print.jsx - Updated Report Part
function PrintReport() {
    const { id } = useParams();
    const { data: report } = useGetReportById(id);

    useEffect(() => {
        if (report) {
            const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${report.type.toUpperCase()} REPORT - NEW DF HOTEL</title>
    <style>
        @media print {
            body { 
                font-family: 'Arial', sans-serif; 
                font-size: 12px; 
                margin: 0;
                padding: 15px;
            }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 10px 0;
                font-size: 10px;
            }
            th, td { 
                border: 1px solid #ddd;
                padding: 6px; 
                text-align: left;
            }
            th { 
                background-color: #f8f9fa;
                font-weight: bold;
            }
            .report-header { 
                text-align: center; 
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
            }
            .report-footer { 
                margin-top: 30px;
                text-align: center;
                font-size: 10px;
                color: #666;
            }
            .summary { 
                margin: 15px 0;
                padding: 10px;
                background-color: #f8f9fa;
                border-left: 4px solid #007bff;
            }
        }
        @media screen {
            body { 
                font-family: 'Arial', sans-serif; 
                font-size: 14px; 
                padding: 20px;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0;
            }
            th, td { 
                border: 1px solid #ddd;
                padding: 8px; 
                text-align: left;
            }
            th { 
                background-color: #f8f9fa;
            }
            .report-header { 
                text-align: center; 
                margin-bottom: 30px;
            }
            .summary { 
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }
            .btn-container { 
                margin: 20px 0; 
                text-align: center;
            }
            button { 
                padding: 10px 20px; 
                margin: 0 10px; 
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <h1>NEW DF HOTEL</h1>
        <h2>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report</h2>
        <p><strong>Period:</strong> ${new Date(report.startDate).toLocaleDateString()} to ${new Date(report.endDate).toLocaleDateString()}</p>
        <p><strong>Generated On:</strong> ${new Date(report.createdAt).toLocaleString()} | <strong>By:</strong> ${report.generatedBy?.username || 'System'}</p>
    </div>

    ${report.content && report.content.length > 0 ? `
        <div class="summary">
            <h3>Report Summary</h3>
            <p><strong>Total Records:</strong> ${report.content.length.toLocaleString()}</p>
            ${report.type === 'sales' ? `<p><strong>Total Sales:</strong> Tshs ${report.content.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)}</p>` : ''}
            ${report.type === 'expenses' ? `<p><strong>Total Expenses:</strong> Tshs ${report.content.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}</p>` : ''}
        </div>

        <table>
            <thead>
                <tr>
                    ${Object.keys(report.content[0]).map(key => `
                        <th>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${report.content.map(row => `
                    <tr>
                        ${Object.keys(row).map(key => `
                            <td>
                                ${['totalPrice', 'amount', 'price', 'totalAmount'].includes(key) && typeof row[key] === 'number' ? 
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
        <p>Generated on ${new Date().toLocaleString()} | NEW DF HOTEL POS System</p>
    </div>

    <div class="btn-container no-print">
        <button onclick="window.print()">Print Report</button>
        <button onclick="window.close()">Close Window</button>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>`;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
        }
    }, [report]);

    return <div className="p-8 text-center">Preparing report for printing...</div>;
}

export default function Print({ type }) {
  const whatToPrint = type === 'sale' ? <PrintSale /> : <PrintReport />;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Preparing {type} for printing...</h2>
      {whatToPrint}
    </div>
  );
}