import {useState,useRef} from 'react'
import {Outlet,useNavigate,useSearchParams,useOutletContext} from 'react-router-dom';
import {useGetAllProducts} from '../hooks/productQuery.js';
import {useAuth} from '../contexts/authContext.jsx';
import Table from '../sharedComponents/table.jsx';
import Button from '../UI/button.jsx';
import Input from '../UI/input.jsx';
import ActionDropdown from '../modals/actionDropdown.jsx';
import Pagination from '../sharedComponents/pagination.jsx';

function ProductRow({product,isAdmin,isManager})
{
    const [isOpen,setIsOpen]=useState(false);
    const triggerRef=useRef(null);
    
    const navigate=useNavigate();

    const actions=[];

    if(isAdmin||isManager)
    {
        actions.push(
            {
            type:'view',
            label:'View',
            onClick:()=>navigate(`/mainRoute/productsManagement/${product._id}/view`)
        },
        {
            type:'edit',
            label:'Edit',
            onClick:()=>navigate(`/mainRoute/productsManagement/${product._id}/edit`)
        }
    )
    }

    if(isAdmin)
    {
        actions.push({
            type:'delete',
            label:'Delete',
            onClick:()=>navigate(`/mainRoute/productsManagement/${product._id}/delete`)
        })
    }
return(
    <tr className='border-b border-light-gray hover:bg-light'>
        <td className='px-6 py-2 md:py-4 text-gray'>{product.name||'N/A'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{product.barcode||'N/A'}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{product.price||0}</td>
        <td className='px-6 py-2 md:py-4 text-gray'>{product.stock||0}</td>
        <td>
            <ActionDropdown
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            actions={actions}
            />

        </td>
    </tr>
)
}

export default function ProductsManagement()
{
    const navigate=useNavigate();

    const[searchParams,setSearchParams]=useSearchParams();
    const page=parseInt(searchParams.get('page')||1);
    const search=searchParams.get('search')||'';
    
    const {user, loading:authLoading}=useAuth();
    const {data,loading:productsLoading}=useGetAllProducts({page,search});

    const handlePageChange=(newPage)=>{
        setSearchParams({page:newPage})
    }

    const context=useOutletContext()
  
    if(authLoading||productsLoading)
    {
        return (
        <div className='h-screen flex items-center justify-center font-normal'>Loading ...</div>
        )
    }

    return(
        <div className='flex flex-col space-y-5'>
            <h1 className=' text-3xl font-semibold text-primary-dark'>Products Management</h1>
            <div className='flex justify-between'>
                <Input
                type='search'
                value={search}
                placeholder='Search for product by name...'
                onChange={ (e)=>setSearchParams(({search:e.target.value,page:1}))}
                />
                
                <Button color1='primary'
                color2='primary-dark'
                onClick={()=>navigate('/mainRoute/productsManagement/add')}>
                    Add New Product
                    </Button>
            </div>

            <Table headers={['name','barcode','price(Tshs)','stock','actions']}>
                {data?.products.map(product=>(
                    <ProductRow
                    key={product._id}
                    product={product}
                    isAdmin={user.role==='admin'}
                    isManager={user.role==='manager'}
                    />
                ))}
            </Table>

            <Pagination 
            currentPage={page}
            totalPages={data?.totalPages}
            onPageChange={handlePageChange}
            />
            <Outlet context={context}/>
        </div>
    )
}