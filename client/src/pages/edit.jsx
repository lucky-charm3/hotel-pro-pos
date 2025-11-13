import {useEffect} from 'react';
import {useParams,useNavigate,useOutletContext} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useUpdateBanking,useGetBankingById} from '../hooks/bankingQuery.js';
import {useUpdateExpense,useGetExpenseById} from '../hooks/expenseQuery.js';
import {useUpdateProduct,useGetProductById} from '../hooks/productQuery.js';
import {useUpdateUser,useGetUserById} from '../hooks/userQuery.js';
import Button from '../UI/button.jsx';
import Modal from '../modals/modal.jsx';

function UpdateBanking({setToast})
{

const {id}=useParams();

const {data:banking}=useGetBankingById(id);

const {register,handleSubmit,formState:{errors},reset}=useForm({mode:'onChange',})

useEffect(() => {
    if (banking) {
      reset({
        type: banking.type,
        amount: banking.amount,
        description: banking.description
      });
    }
  }, [banking, reset]);

const{mutate:updateBanking}=useUpdateBanking();

const onSubmit=(data)=>{
    try{
    updateBanking(data);
    setToast(prev=>({...prev,
                                         status:'success',
                                         message:'Banking updated succesfully'}))
    }
    catch(error)
    {
   setToast(prev=>({...prev,
                                            isOpen:true,
                                            status:'danger',
                                            message:error.message}))
    }
}

return(
<form onSubmit={handleSubmit(onSubmit)}>
           <label className='flex flex-col space-y-2'>
            <span>Type:</span>
            <select className='input' 
            {...register('type',{required:true})}>
                <option value=''>Select transaction type</option>
                <option value='withdrawal'>Withdrawal</option>
                <option value='transfer'>Transfer</option>
                <option value='deposit'>Deposit</option>
            </select>
            <p className='font-thin text-danger text-xs'>{errors?.type?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Amount:</span>
                <input type='number' className='input'
                {...register('amount',{required:true,
                    min:{
                        value:0,
                        message:'The amount shouldnt be less than zero'
                    }})}
                    />
                    <p className='text-danger text-xs font-thin'>{errors?.amount?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Description:</span>
                <input  className='input'
                {...register('description',{
                    maxLength:{
                        value:200,
                        message:'The description shouldnt be more than 200 characters'
                    }})}
                    />
                    <p className='text-danger text-xs font-thin'>{errors?.description?.message}</p>
            </label>
         <Button type='submit' color1='primary'  color2='primary-dark'>
          Update Banking
         </Button>
        </form>
)
}

function UpdateExpense({setToast})
{
const {id}=useParams();

const {data:expense}=useGetExpenseById(id);

const{register,handleSubmit,formState:{errors},reset}=useForm({mode:'onChange', });

useEffect(()=>{
reset({
name:expense?.name,
category:expense?.category,
description:expense?.description})                                                                                                                                      
},[expense,reset])

 const{mutate:updateExpense}=useUpdateExpense();

 const categories=[ 'utilities', 'rent','maintenance','transportation', 'security',
    'inventory','supplies','salaries','advertising','software',
    'bank_charges','loan_interest','miscellaneous']

const onSubmit=(data)=>{
    try{
  updateExpense(data);
  setToast(prev=>({...prev,
                        isOpen:true,
                        message:'Expense updated successfully',
                        status:'success'
}))
    }
    catch(error){
setToast(prev=>({...prev,
                     message:error.message,
                     status:'danger'
}))
    }
}
return(
     <form  onSubmit={handleSubmit(onSubmit)}>
             <label className='flex flex-col space-y-2'>
                <span>Expense Name:</span>
                <input className='input'
                 {...register('name',{required:true,minLength:{
                    value:2,
                    message:'Expense should contain atleast two characters'}})}
                    />
                    <p className='text-danger font-thin text-xs'>{errors?.name?.message}</p>
                </label>
    
                 <label className='flex flex-col space-y-2'>
                    <span>Expense Category:</span>
                    <select className='input'
                    {...register('category',{required:true})}>
                        <option value=''>Select category</option>
        {categories.map((c,index)=>(
            <option key={index} value={c}>
                {c}
            </option>
        ))}
                    </select>
                    </label>
    
                    <label className='flex flex-col space-y-2'>
                <span>Description:</span>
                <input className='input'
                 {...register('description',{maxLength:{
                    value:200,
                    message:'Description shouldnt exceed 200 characters'}
                })}
                    />
                    <p className='text-danger font-thin text-xs'>{errors?.description?.message}</p>
                </label>
    
                <Button type='submit' color1='primary' color2='primary-dark'>
                    Update Expense
                </Button>
        </form>
)
}

function UpdateProduct({setToast})
{
    const{id}=useParams();

    const {data:product}=useGetProductById(id);

    const{register,formState:{errors},handleSubmit,reset}=useForm({
                                                                                                                        mode:'onChange',})
   
   useEffect(()=>{
   reset({
   name:product?.name,
   price:product?.price,
   stock:product?.stock,
   category:product?.category
})
   },[product,reset])

const{mutate:updateProduct}=useUpdateProduct();

    const categories=['foods','drinks','services','others']

    const onSubmit=(data)=>{
        try{
     updateProduct(data);
     setToast(prev=>({...prev, 
                      status:'success',
                      message:'Product updated succesfully'}
    ))
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='flex flex-col space-y-2'>
            <span>Name:</span>
            <input className='input'
            {...register('name',{
                required:true,
                min:{
                    value:2,
                    message:'A product name should contain atleast 2 characters'
                }})}
                />
                <p className='text-danger text-xs font-thin'>{errors?.name?.message}</p>
                </label>

                <label className='flex flex-col space-y-2'>
            <span>Price:</span>
            <input className='input' type='number'
            {...register('price',{
                required:true,
                min:{
                    value:0,
                    message:'Price cannot be below 0'
                }})}
                />
                <p className='text-danger text-xs font-thin'>{errors?.price?.message}</p>
                </label>

                 <label className='flex flex-col space-y-2'>
            <span>Stock:</span>
            <input className='input' type='number'
            {...register('stock',{
                required:true,
                minLength:{
                    value:0,
                    message:'Stock cannot be below 0'
                }})}
                />
                <p className='text-danger text-xs font-thin'>{errors?.stock?.message}</p>
                </label>

              <label className='flex flex-col space-y-2'>
                <span>Category:</span>
                <select className='input'
                {...register('category',{required:true})}>
                    <option value=''>Select Category</option>
                {categories.map(c=>(
                    <option key={c} value={c}>
                          {c}
                    </option>
                ))}
                </select>
                <p className='text-danger font-thin text-xs'>{errors?.category?.message}</p>
                </label>
                <Button type='submit'
                color1='primary'
                color2='primary-dark'>
                    Update Product
                    </Button>
            </form>
    )
}

function UpdateUser({setToast})
{
    const {id}=useParams();

    const{data}=useGetUserById(id);

    const user=data.user;

    const{register,handleSubmit,watch,formState:{errors},reset}=useForm({
                                                                                                                            mode:'onChange'});
    
 useEffect(()=>{
  reset({
    username:user?.username,
    email:user?.email,
    phone:user?.phone,
    role:user?.role,
    password:user?.password,
    confirmPassword:user?.password
    })
    },[user,reset])
    const{mutate:updateUser}=useUpdateUser();

    const password=watch('password');

    const onSubmit=(data)=>{
        try{
            updateUser(data);
            setToast(prev=>({...prev,
                                                    isOpen:true,
                                                    status:'success',
                                                    message:'User added succesfully'
                                                }))
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
    <form onSubmit={handleSubmit(onSubmit)}>
        <label className='flex flex-col space-y-2'>
            <span>Name:</span>
            <input {...register('username',
            {
                required:true,
                minLength:3,
                pattern:{
                    value:/^[a-zA-Z0-9]{3,30}$/,
                    message:'Username should only contain 3 or more alphanumeric characters '
                }
            }
        )}
        className='input'
        />
        <p className='text-xs text-danger font-thin'>{errors?.username?.message}</p>
        </label>

        <label className='flex flex-col space-y-2'>
            <span>Email:</span>
            <input {...register('email',
            {
                required:true,
                pattern:{
                    value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:'Please input a correct email '
                }
            }
        )}
        className='input'
        />
        <p className='text-xs text-danger font-thin'>{errors?.email?.message}</p>
        </label>

        <label className='flex flex-col space-y-2'>
            <span>Phone:</span>
            <input {...register('phone',
            {
                required:true,
                pattern:{
                    value:/^[0-9]{10,15}$/,
                    message:'Please input a correct phone number'
                }
            }
        )}
        className='input'
        />
        <p className='text-xs text-danger font-thin'>{errors?.phone?.message}</p>
        </label>


      <label className='flex flex-col space-y-2'>
            <span>Role:</span>
            <select {...register('role',{required:true})} className='input'>
            <option value=''>Select a role</option>
            <option value='admin'>Admin</option>
            <option value='manager'>Manager</option>
            <option value='cashier'>Cashier</option>
            </select>
            <p className='text-xs text-danger font-thin'>{errors?.role?.message}</p>
        </label>

        <label className='flex flex-col space-y-2'>
            <span>Password:</span>
            <input type='password' {...register('password',
            {
                required:true,
                minLength:{
                    value:6,
                    message:'A password should be atleast 6 characters'
                }
            }
        )}
        className='input'
        />
        <p className='text-xs text-danger font-thin'>{errors?.password?.message}</p>
        </label>

        <label className='flex flex-col space-y-2'>
            <span>Password:</span>
            <input type='password' {...register('confirmPassword',
            {
                required:true,
                validate:(value)=>value===password||'Passwords do not match'
            }
        )}
        className='input'
        />
        <p className='text-xs text-danger font-thin'>{errors?.confirmPassword?.message}</p>
        </label>

        <Button type='submit' color1='primary' color2='primary-dark'>
            Add User
            </Button>
    </form>
)
}

export default function Edit({type})
{
    const navigate=useNavigate();

    const{setToast}=useOutletContext()

    const editToDisplay=type==='banking'?<UpdateBanking setToast={setToast}/>:
                                                  type==='expense'?<UpdateExpense setToast={setToast}/>:
                                                  type==='product'?<UpdateProduct setToast={setToast}/>:
                                                  <UpdateUser setToast={setToast}/>

    return(
       <Modal title={`Edit ${type}`} onClose={()=>navigate(-1)}>
                {editToDisplay}
                  </Modal>
    )
}