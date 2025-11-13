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
        
        <p><strong>Staff:</strong> ${sale.createdBy?.username || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>
        <p><strong>Receipt #:</strong> ${sale.reference || id}</p>
        
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
            ${sale.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
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

function PrintReport() {
    const { id } = useParams();
    const { data: report } = useGetReportById(id); // You need this hook

    useEffect(() => {
        if (report) {
            // Auto-print when report data loads
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [report]);

    if (!report) {
        return <div>Loading report...</div>;
    }

    return (
        <div className="p-8 print:p-0">
            {/* Printable report content */}
            <div className="report-header text-center mb-8 print:mb-4">
                <h1 className="text-2xl font-bold">{report.type.toUpperCase()} REPORT</h1>
                <p>New DF Hotel</p>
                <p>Period: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</p>
            </div>

            {/* Report content table */}
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        {Object.keys(report.content[0] || {}).map(key => (
                            <th key={key} className="border p-2 text-left">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {report.content.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, i) => (
                                <td key={i} className="border p-2">{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="no-print mt-8 text-center">
                <button 
                    onClick={() => window.print()}
                    className="bg-blue-500 text-white px-6 py-2 rounded mr-4"
                >
                    Print Again
                </button>
                <button 
                    onClick={() => window.close()}
                    className="bg-gray-500 text-white px-6 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
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