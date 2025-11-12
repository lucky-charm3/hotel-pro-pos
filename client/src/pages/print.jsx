import { useEffect } from "react";
import {useParams} from 'react-router-dom';
import {useGetSaleById} from '../hooks/saleQuery.js';

function PrintSale() {
  const { id } = useParams();
  const { data: sale } = useGetSaleById(id);

  useEffect(() => {
    if (!sale) return;

    const receiptWindow = window.open(`/mainRoute/salesManagement/${id}/print`, "_blank");
    const html = `
      <html style="font-family: monospace; font-size: 12px;">
      <body id="receipt-content">
        <h1>New DF Hotel</h1>
        <p>Sale issued by ${sale.createdBy.username} on ${sale.createdAt}</p>
        <hr/>
        <h1>Items sold</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map(
              (i) => `
              <tr>
                <td>${i.name}</td>
                <td>${i.qty}</td>
                <td>${i.price}</td>
                <td>${i.subtotal}</td>
              </tr>`
            ).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    receiptWindow.document.write(html);
    receiptWindow.document.close();
    receiptWindow.focus();
  }, [sale]);

  return null;
}


function PrintReport()
{
return(
    <div>
        Report printing
    </div>
)
}

export default function Print({type})
{
const whatToPrint=type==='sale'?
                                            <PrintSale/>:<PrintReport/>

return(
    <div>
        {whatToPrint}
    </div>
)
}