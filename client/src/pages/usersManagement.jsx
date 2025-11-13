import {useState,useRef} from 'react';
import {useAuth} from '../contexts/authContext.jsx';
import {Outlet,useNavigate,useSearchParams,useOutletContext} from 'react-router-dom';
import {useGetUsers,useGetCashiers} from '../hooks/userQuery.js';
import Table from '../sharedComponents/table.jsx';
import Button from '../UI/button.jsx';
import Input from '../UI/input.jsx';
import ActionDropdown from '../modals/actionDropdown.jsx';
import Pagination from '../sharedComponents/pagination.jsx';

const contents={
    admin:{
        title:'Manage Users',
        buttonLabel:'Add New User'
    },
    manager:{
        title:'Manage Cashiers',
        buttonLabel:'Add New Cashier'
    }
}

function UserRow({user,isAdmin,isManager})
{
    const [isOpen,setIsOpen]=useState(false);
    const triggerRef=useRef(null);

    const navigate=useNavigate();

    const actions=[];

    if(isAdmin||isManager)
    {
        actions.push(
            {
                type:'edit',
                label:'Edit',
                onClick:()=>navigate(`/mainRoute/usersManagement/${user._id}/edit`)
            },
            {
                type:'view',
                label:'View',
                onClick:()=>navigate(`/mainRoute/usersManagement/${user._id}/view`)
            }
        )
    }

    if(isAdmin)
    {
   actions.push({
    type:'delete',
    label:'Delete',
    onClick:()=>navigate(`/mainRoute/usersManagement/${user._id}/delete`)
   })
    }

    return(
        <tr className='border-b border-light-gray hover:bg-light'>
            <td className='px-6 py-2 md:py-4 text-gray'>{user.username||'Unknown'}</td>
            <td className='px-6 py-2 md:py-4 text-gray'>{user.email||'NO-EMAIL'}</td>
            <td className='px-6 py-2 md:py-4 text-gray'>{user.phone||'N/A'}</td>
            <td className='px-6 py-2 md:py-4 text-gray'>{user.role}</td>
            <td className='px-6 py-2 md:py-4'>
                <span className="text-center text-sm bg-green-300 rounded-full px-1 py-2">
                {user.isActive?'ACTIVE':'INACTIVE'}
                </span>
                </td>
            <td>
                <ActionDropdown
                actions={actions}
                triggerRef={triggerRef}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                />

            </td>
        </tr>

    )
}

export default function UsersManagement()
{
    const {user,loading:authLoading}=useAuth();

    const [searchParams,setSearchParams]=useSearchParams();

    const page=parseInt(searchParams.get('page')||1);
    const search=searchParams.get('search')||'';

    const {data:usersData,isLoading:usersLoading}=useGetUsers({page,search});
    const {data:cashiersData,isLoading:cashiersLoading}=useGetCashiers({page,search});

    const navigate=useNavigate();

    const users=user.role==='admin'?usersData?.users:cashiersData?.cashiers;

    const handlePageChange=(newPage)=>{
  setSearchParams({page:newPage})
    }

    const context=useOutletContext();

    if(usersLoading||authLoading||cashiersLoading)
    {
        return (
            <div className='h-screen flex justify-center items-center'>Loading...</div>
        )
    }


    return(
<section className='rounded-lg p-4 flex flex-col space-y-5'>
    <h1 className=' text-3xl font-semibold text-primary-dark'>
        {contents[user.role]['title']}
    </h1>
    <div className='flex space-x-2'>
        <Input 
        type='search'
        value={search}
        onChange={(e)=>setSearchParams({search:e.target.value,page:1})}
        placeholder='Search for users by name...'
        />

    <Button onClick={()=>navigate('/mainRoute/usersManagement/add')}
    color1='primary' color2='primary-dark'>
         {contents[user.role]['buttonLabel']}
    </Button>
    </div>

    <Table headers={['username','email','phone','role','status','actions']}>
{users?.map(u=>(
    <UserRow
    key={u._id}
    user={u}
    isAdmin={user.role==='admin'}
    isManager={user.role==='manager'}
/>
))
}
    </Table>

    <Pagination
     currentPage={page}
     onPageChange={handlePageChange}
     totalPages={user.role==='admin'?
        usersData.totalPages:
        cashiersData.totalPages}
     />
    
   <Outlet context={context}/>
</section>
    )
}