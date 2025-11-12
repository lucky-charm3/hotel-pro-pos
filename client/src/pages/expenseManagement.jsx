import {useState,useRef} from 'react';
import {useNavigate,Outlet,useSearchParams,useOutletContext} from 'react-router-dom'
import {useGetAllExpenses} from '../hooks/expenseQuery.js'
import {useAuth} from '../contexts/authContext.jsx';
import Pagination from '../sharedComponents/pagination.jsx';
import ActionDropdown from '../modals/actionDropdown.jsx';
import Table from '../sharedComponents/table.jsx';
import Input from '../UI/input.jsx';
import Button from '../UI/button.jsx';

function ExpenseRow({expense,isAdmin,isManager})
{
const triggerRef=useRef(null);

const [isOpen,setIsOpen]=useState(false);

const navigate=useNavigate();

const actions=[];

if(isAdmin||isManager)
{
    actions.push({
        type:'view',
        label:'View',
        onClick:()=>navigate(`/mainRoute/moneyManagement/expenses/${expense._id}/view`)
    },
   {
    type:'edit',
    label:'Edit',
    onClick:()=>navigate(`/mainRoute/moneyManagement/expenses/${expense._id}/edit`)
   }
)
}

if(isAdmin)
{
    actions.push({
        type:'delete',
        label:'Delete',
        onClick:()=>navigate(`/mainRoute/moneyManagement/expenses/${expense._id}/delete`)
        })
}

return(
    <tr className='border-b border-light-gray hover:bg-light'>
        <td className='px-6 py-2 md:py-4 text-gray'>{expense?.name||'N/A'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>Tshs{expense?.amount||0}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{expense?.category||'N/A'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{expense?.recordedBy.username||'Unknown'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{expense?.description||'expense'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{expense?.createdAt||'N/A'}</td>
        <td>
            <ActionDropdown 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            actions={actions} />
        </td>
    </tr>
)
}

export default function ExpenseManagement()
{

const[searchParams,setSearchParams]=useSearchParams();
const page=parseInt(searchParams.get('page')||1);
const search=searchParams.get('search')||'';

const{data,loading:expensesLoading}=useGetAllExpenses({page,search,limit:15});

const {user,loading:authLoading}=useAuth();

 const navigate=useNavigate();

 const outletContext=useOutletContext();

const handlePageChange=(newPage)=>{
    setSearchParams({page:newPage})
}

if(expensesLoading||authLoading)
{
    return(
        <div className='flex justify-center items-center h-screen'>Loading...</div>
    )
}

    return(
       <div className='mt-5  bg-light'>
            <h1 className=' text-xl font-semibold text-primary-dark mb-5'>EXPENSES</h1>
            <div className='flex justify-around'>
                {console.log('the action dropdown component ',ActionDropdown)}
                <Input 
                value={search}
                type='search'
                onChange={(e)=>setSearchParams({search:e.target.value})}
                placeholder='Search for expenses here ...'
                />
                <Button onClick={()=>navigate('/mainRoute/moneyManagement/expenses/add')}
                color1='primary' 
                color2='primary-dark' >
                    Add New Expense
                    </Button>
            </div>

    <Table headers={['name','amount(Tshs)','category','recordedBy','description','spentOn','actions']}>
   {data?.expenses.map(expense=>(
    <ExpenseRow 
    key={expense._id}
    expense={expense}
    isAdmin={user.role==='admin'}
    isManager={user.role==='manager'}
    />
   ))}
    </Table>

    <Pagination currentPage={page}
    totalPages={data?.totalPages}
    onPageChange={handlePageChange}
    />
            <Outlet context={outletContext}/>
        </div>
    )
}