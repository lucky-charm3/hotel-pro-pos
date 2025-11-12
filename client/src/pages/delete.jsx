import {useNavigate,useParams,useOutletContext} from 'react-router-dom';
import {useDeleteProduct} from '../hooks/productQuery.js';
import {useDeleteExpense} from '../hooks/expenseQuery.js';
import {useDeleteBanking} from '../hooks/bankingQuery.js';
import {useDeleteSale} from '../hooks/saleQuery.js';
import {useDeleteUser} from '../hooks/userQuery.js';
import {useDeleteReport} from '../hooks/reportQuery.js';
import Button from '../UI/button.jsx';
import Modal from '../modals/modal.jsx';
import Toast from '../modals/toast.jsx';

function DeleteProduct({setToast})
{
  const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteProduct}=useDeleteProduct();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteProduct(id);
    setToast(prev=>({...prev,
                          isOpen:true,
                          status:'success',
                          message:'Product deleted succesfully'
                        }))
    navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                           isOpen:true,
                          status:'danger',
                          message:error.message
                        }))
  }
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this product?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='danger'>
      Yes,Delete Product
    </Button>
  </div>
  </>
)
}

function DeleteExpense({setToast})
{
 const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteExpense}=useDeleteExpense();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteExpense(id);
    setToast(prev=>({...prev,
                           isOpen:true,
                          status:'success',
                          message:'Expense deleted succesfully'
                        }))
  navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                           isOpen:true,
                          status:'danger',
                          message:error.message
                        }))
  }
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this expense?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='danger'>
      Yes,Delete Expense
    </Button>
  </div>
  </>
)
}

function DeleteBanking({setToast})
{
 const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteBanking}=useDeleteBanking();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteBanking(id);
    setToast(prev=>({...prev,
                           isOpen:true,
                          status:'success',
                          message:'Banking deleted succesfully'
                        }))
    navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                           isOpen:true,
                          status:'danger',
                          message:error.message
                        }))
  }
  
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this banking?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='danger'>
      Yes,Delete Banking
    </Button>
  </div>
  </>
)
}

function DeleteSale({setToast})
{
 const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteSale}=useDeleteSale();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteSale(id);
    setToast(prev=>({...prev,
                          isOpen:true,
                          status:'success',
                          message:'Sale deleted succesfully'
                        }))
  navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                          status:'danger',
                          message:error.message
                        }))
  }
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this sale?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='warning'>
      Yes,Delete Sale
    </Button>
  </div>
  </>
)
}

function DeleteUser({setToast})
{
 const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteProduct}=useDeleteUser();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteProduct(id);
    setToast(prev=>({...prev,
                          isOpen:true,
                          status:'success',
                          message:'User deleted succesfully'
                        }))
  navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                          isOpen:true,
                          status:'danger',
                          message:error.message
                        }))
  }
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this user?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='danger'>
      Yes,Delete User
    </Button>
  </div>
  </>
)
}

function DeleteReport({setToast})
{
 const navigate=useNavigate();

  const {id}=useParams();

  const {mutate:deleteReport}=useDeleteReport();

const handleClick=(e)=>{
  try
  {
    e.preventDefault();
    deleteReport(id);
    setToast(prev=>({...prev,
                          isOpen:true,
                          status:'success',
                          message:'Report deleted succesfully'
                        }))
   navigate(-1);
  }
  catch(error)
  {
 setToast(prev=>({...prev,
                          isOpen:true,
                          status:'danger',
                          message:error.message
                        }))
  }
}

return(
  <>
  <p className='text-center'>Are you sure you want to delete this report?</p>
  <div className='flex justify-around'>
    <Button type='button' onClick={()=>navigate(-1)} color1='primary' color2='primary-dark'>
      Cancel
    </Button>
    <Button type='button' onClick={handleClick} color1='danger' color2='danger'>
      Yes,Delete Report
    </Button>
  </div>
  </>
)
}

export default function Delete({type}) 
{
  const {setToast}=useOutletContext();

  const navigate=useNavigate();

  const deleteToDisplay=type==='sale'?<DeleteSale setToast={setToast}/>:
                                                     type==='banking'?<DeleteBanking setToast={setToast}/>:
                                                     type==='expense'?<DeleteExpense setToast={setToast}/>:
                                                     type==='product'?<DeleteProduct setToast={setToast}/>:
                                                     type==='report'?<DeleteReport setToast={setToast}/>:
                                                     <DeleteUser setToast={setToast}/>

  return (
    <Modal title={`Delete ${type}`} onClose={()=>navigate(-1)}>
      <div className="text-center flex flex-col space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
       {deleteToDisplay} 
         </div>
    </Modal>
  );
}