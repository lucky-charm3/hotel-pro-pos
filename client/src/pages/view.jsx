import {useParams,useNavigate} from 'react-router-dom';
import {useGetSaleDetails} from '../hooks/saleQuery.js';
import {useGetBankingById} from '../hooks/bankingQuery.js';
import {useGetExpenseById} from '../hooks/expenseQuery.js';
import {useGetProductById} from '../hooks/productQuery.js';
import {useGetUserById} from '../hooks/userQuery.js';
import {useGetReportById} from '../hooks/reportQuery.js';
import Modal from '../modals/modal.jsx';
import Table from '../sharedComponents/table.jsx';

const SaleView=()=>{
    const {id}=useParams();
    const {data:sale}=useGetSaleDetails(id);

    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>Sale id:</span> {sale?.id}</p>
            <p><span className='font-semibold'>Total price:</span> {sale?.total_price}Tshs</p>
            <p><span className='font-semibold'>Payment Method: </span>{sale?.payment_method}</p>
            <p><span className='font-semibold'>Created At:</span> {sale?.created_at?.split('T')[0]}</p>
            <p><span className='font-semibold'>Sale cashier:</span> {sale?.cashier}</p>
            <h1 className='font-semibold'>Items sold:</h1>
            <Table headers={['product name','price','quantity','item total']}>
                {sale?.items?.map(item=>(
                    <tr key={item.product_name}>
                        <td className='px-6 py-2'>{item.product_name}</td>
                        <td className='px-6 py-2'>{item.price}</td>
                        <td className='px-6 py-2'>{item.quantity}</td>
                        <td className='px-6 py-2'>{item.item_total}</td>
                    </tr>
                ))}
            </Table>
        </div>
    )
};

const BankingView=()=>{
    const {id}=useParams();
    const {data:banking}=useGetBankingById(id);

    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>Banking type:</span> {banking?.type}</p>
            <p><span className='font-semibold'>Amount:</span> {banking?.amount}</p>
            <p><span className='font-semibold'>Performed by:</span> {banking?.performedBy?.username}</p>
            <p><span className='font-semibold'>Contact:</span> {banking?.performedBy?.phone}</p>
            <p><span className='font-semibold'>Description:</span> {banking?.description}</p>
            <p><span className='font-semibold'>Reference:</span> {banking?.reference}</p>
            <p><span className='font-semibold'>Created At:</span> {banking?.createdAt?.split('T')[0]}</p>
        </div>
    )
};

const ExpenseView=()=>{
    const {id}=useParams();
    const {data:expense}=useGetExpenseById(id);
    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>Expense name:</span> {expense?.name}</p>
            <p><span className='font-semibold'>Amount spent:</span> {expense?.amount}</p>
            <p><span className='font-semibold'>Category:</span> {expense?.category}</p>
            <p><span className='font-semibold'>Recorded By:</span> {expense?.recordedBy?.username}</p>
            <p><span className='font-semibold'>Contact:</span> {expense?.recordedBy?.phone}</p>
            <p><span className='font-semibold'>Description:</span> {expense?.description}</p>
            <p><span className='font-semibold'>Created At:</span> {expense?.createdAt?.split('T')[0]}</p>
        </div>
    )
};

const ProductView=()=>{
    const {id}=useParams();
    const {data:product}=useGetProductById(id);
    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>Product name:</span> {product?.name}</p>
            <p><span className='font-semibold'>Barcode:</span> {product?.barcode}</p>
            <p><span className='font-semibold'>Price:</span> {product?.price}</p>
            <p><span className='font-semibold'>Stock:</span> {product?.stock}</p>
            <p><span className='font-semibold'>Category: </span>{product?.category}</p>
            <p><span className='font-semibold'>Created At:</span> {product?.createdAt}</p>
        </div>
    )
};

const UserView=()=>{
    const {id}=useParams();
    const {data:user}=useGetUserById(id);

    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>User name:</span> {user?.user.username||'Unknown'}</p>
            <p><span className='font-semibold'>Email:</span> {user?.user.email||'NO-EMAIL'}</p>
            <p><span className='font-semibold'>Phone Number:</span> {user?.user.phone||'N/A'}</p>
            <p><span className='font-semibold'>Role:</span> {user?.user.role||'N.A'}</p>
            <p><span className='font-semibold'>Active User?:</span> {String(user?.user.isActive)}</p>
        </div>
    )
};

const ReportView=()=>{
    const {id}=useParams();
    const {data:report}=useGetReportById(id);
    return(
        <div className='flex flex-col space-y-6'>
            <p><span className='font-semibold'>Start date:</span> {report?.startDate}</p>
            <p><span className='font-semibold'>End date:</span> {report?.endDate}</p>
            <p><span className='font-semibold'>Generated By:</span> {report?.generatedBy?.username}</p>
            <p><span className='font-semibold'>Report Type:</span>{report?.type}</p>
        </div>
    )
};

export default function View({type}){
    const navigate=useNavigate();
    const Comp=type==='sale'?SaleView:
               type==='banking'?BankingView:
               type==='expense'?ExpenseView:
               type==='product'?ProductView:
               type==='user'?UserView:ReportView;

    return <Modal title={`View ${type}`} onClose={()=>navigate(-1)}><Comp/></Modal>;
}