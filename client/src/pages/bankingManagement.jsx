import {useState,useRef} from 'react';
import {useAuth} from '../contexts/authContext.jsx'
import {Outlet,useNavigate,useSearchParams,useOutletContext} from 'react-router-dom';
import ActionDropdown from '../modals/actionDropdown.jsx';
import {useGetAllBanking} from '../hooks/bankingQuery.js';
import Pagination from '../sharedComponents/pagination.jsx';
import Table from '../sharedComponents/table.jsx';
import Input from '../UI/input.jsx';
import Button from '../UI/button.jsx';

function BankingRow({banking,isAdmin,isManager})
{
    const [isOpen,setIsOpen]=useState(false);
    const triggerRef=useRef(null);

    const navigate=useNavigate()

    const actions=[];

      if(isAdmin||isManager)
      {
        actions.push(
            {
                type:'view',
                label:'View',
                onClick:()=>navigate(`/mainRoute/moneyManagement/banking/${banking._id}/view`)
            },
            {
                type:'edit',
                label:'Edit',
                onClick:()=>navigate(`/mainRoute/moneyManagement/banking/${banking._id}/edit`)
            }
        )
      }

    if (isAdmin)
    {
     actions.push({
        type:'delete',
        label:'Delete',
        onClick:()=>navigate(`/mainRoute/moneyManagement/banking/${banking._id}/delete`)
     })
    }

return(
    <tr className='border-b border-light-gray hover:bg-light'>
    <td className='px-6 md:py-4 py-2 text-gray'>{banking?.type||'N/A'}</td>
    <td className='px-6 md:py-4 py-2 text-gray'>{banking?.amount||0}</td>
    <td className='px-6 md:py-4 py-2 text-gray'>{banking?.performedBy.username||'Unknown'}</td>
    <td className='px-6 md:py-4 py-2 text-gray'>{banking?.description||'N/A'}</td>
    <td className='px-6 md:py-4 py-2 text-gray'>{banking?.reference||'N/A'}</td>
    <td className='px-6 md:py-4 py-2 text-gray'>
        <ActionDropdown 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        actions={actions}
        triggerRef={triggerRef}
        />
    </td>
    </tr>
)
}

export default function BankingManagement()
{
    const navigate=useNavigate();

    const outletContext=useOutletContext();

    const {user,loading:authLoading}=useAuth()

    const [searchParams,setSearchParams]=useSearchParams();

    const page=parseInt(searchParams.get('page')||1);
    const search=searchParams.get('search')||'';

    const {data,loading:bankingLoading}=useGetAllBanking({page,search})
    
    const handlePageChange=(newPage)=>{
        setSearchParams(({page:newPage}))
    }

    if(authLoading||bankingLoading)
    {
        return(
            <div className='h-screen flex justify-center items-center'>Loading...</div>
        )
    }

    return(
        <div className='mt-5  bg-light '>
            <h1 className=' text-xl font-semibold text-primary-dark mb-5'>BANKING</h1>
              <div className='flex justify-around'>
                <Input
                type='search'
                value={search}
                placeholder='Search banking transactions ......'
                onChange={(e)=>setSearchParams(({search:e.target.value,page:1}))}
                />

                <Button 
                onClick={()=>navigate('/mainRoute/moneyManagement/expenses/add')}
                color1='primary' 
                color2='primary-dark'>
                    Add New Transaction
                    </Button>
              </div>

              <Table headers={['type','amount(Tshs)','performedBy','description','reference']}>
                {data?.banking.map(b=>(
                    <BankingRow 
                    key={b._id}
                    isAdmin={user.role==='admin'}
                    isManager={user.role==='manager'}
                    banking={b}
                    />
                ))}
              </Table>
              
              <Pagination
              currentPage={page}
              totalPages={data?.totalPages}
              onPageChange={handlePageChange}
              />
            <Outlet context={outletContext}/>
        </div>
    )
}