import {useState} from 'react';
import {useNavigate,useOutletContext} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {useCreateUser} from '../hooks/userQuery.js';
import {useCreateBanking} from '../hooks/bankingQuery.js';
import {useCreateExpense} from '../hooks/expenseQuery.js';
import {useCreateProduct} from '../hooks/productQuery.js';
import {useGetAllProducts} from '../hooks/productQuery.js';
import {useCreateSale} from '../hooks/saleQuery.js';
import {FaTrash} from 'react-icons/fa';
import Modal from '../modals/modal.jsx';
import Button from '../UI/button.jsx';
import Table from '../sharedComponents/table.jsx';

function AddUser({setToast}){
    const{register,handleSubmit,watch,formState:{errors}}=useForm({mode:'onChange'});
    const{mutateAsync:createUser}=useCreateUser();
    const password=watch('password');

    const onSubmit=async (data)=>{
        try{
            await createUser(data);
            setToast({isOpen:true,status:'success',message:'User added succesfully'});
        }catch(error){
            setToast({
                isOpen:true,
                status:'danger',
                message:error.message});
        }
    };
    
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='flex flex-col space-y-2'>
                <span>Name:</span>
                <input {...register('username',{required:true,minLength:3,pattern:{value:/^[a-zA-Z0-9]{3,30}$/,message:'Username should only contain 3 or more alphanumeric characters'}})} className='input'/>
                <p className='text-xs text-danger font-thin'>{errors.username?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Email:</span>
                <input {...register('email',{required:true,pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'Please input a correct email'}})} className='input'/>
                <p className='text-xs text-danger font-thin'>{errors.email?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Phone:</span>
                <input {...register('phone',{required:true,pattern:{value:/^[0-9]{10,15}$/,message:'Please input a correct phone number'}})} className='input'/>
                <p className='text-xs text-danger font-thin'>{errors.phone?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Role:</span>
                <select {...register('role',{required:true})} className='input'>
                    <option value=''>Select a role</option>
                    <option value='admin'>Admin</option>
                    <option value='manager'>Manager</option>
                    <option value='cashier'>Cashier</option>
                </select>
                <p className='text-xs text-danger font-thin'>{errors.role?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Password:</span>
                <input type='password' {...register('password',{required:true,minLength:{value:6,message:'A password should be atleast 6 characters'}})} className='input'/>
                <p className='text-xs text-danger font-thin'>{errors.password?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Confirm Password:</span>
                <input type='password' {...register('confirmPassword',{required:true,validate:(value)=>value===password||'Passwords do not match'})} className='input'/>
                <p className='text-xs text-danger font-thin'>{errors.confirmPassword?.message}</p>
            </label>

            <Button type='submit' color1='primary' color2='primary-dark'>Add User</Button>
        </form>
    )
}

function AddBanking({setToast}){
    const {register,handleSubmit,formState:{errors}}=useForm({mode:'onChange'});
    const {mutateAsync:createBanking}=useCreateBanking();

    const onSubmit=async (data)=>{
        try{
            await createBanking(data);
            setToast({isOpen:true,status:'success',message:'Banking created succesfully'});
        }catch(error){
            setToast({isOpen:true,status:'danger',message:error.message});
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='flex flex-col space-y-2'>
                <span>Type:</span>
                <select {...register('type',{required:true})} className='input'>
                    <option value=''>Select transaction type</option>
                    <option value='withdrawal'>Withdrawal</option>
                    <option value='transfer'>Transfer</option>
                    <option value='deposit'>Deposit</option>
                </select>
                <p className='font-thin text-danger text-xs'>{errors.type?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Amount:</span>
                <input type='number' {...register('amount',{required:true,min:{value:0,message:'The amount shouldnt be less than zero'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.amount?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Description:</span>
                <input {...register('description',{maxLength:{value:200,message:'The description shouldnt be more than 200 characters'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.description?.message}</p>
            </label>

            <Button type='submit' color1='primary' color2='primary-dark'>Add Banking</Button>
        </form>
    )
}

function AddExpense({setToast}){
    const {register,handleSubmit,formState:{errors}}=useForm({mode:'onChange'});
    const {mutateAsync:createExpense}=useCreateExpense();
    const categories=['utilities','rent','maintenance','transportation','security','inventory','supplies','salaries','advertising','software','bank_charges','loan_interest','miscellaneous'];

    const onSubmit=async (data)=>{
        try{
            await createExpense(data);
            setToast({isOpen:true,status:'success',message:'Expense created succesfully'});
        }catch(error){
            setToast({isOpen:true,status:'danger',message:error.message});
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='flex flex-col space-y-2'>
                <span>Name:</span>
                <input {...register('name',{required:true,minLength:{value:2,message:'Expense should contain atleast two characters'}})} className='input'/>
                <p className='text-danger font-thin text-xs'>{errors.name?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Amount:</span>
                <input type='number' {...register('amount',{required:true,min:{value:0,message:'The amount shouldnt be less than zero'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.amount?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Category:</span>
                <select {...register('category',{required:true})} className='input'>
                    <option value=''>Select category</option>
                    {categories.map((c,i)=><option key={i} value={c}>{c}</option>)}
                </select>
                <p className='text-danger font-thin text-xs'>{errors.category?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Description:</span>
                <input {...register('description',{maxLength:{value:200,message:'The description shouldnt be more than 200 characters'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.description?.message}</p>
            </label>

            <Button type='submit' color1='primary' color2='primary-dark'>Add Expense</Button>
        </form>
    )
}

function AddProduct({setToast}){
    const {register,handleSubmit,formState:{errors}}=useForm({mode:'onChange'});
    const {mutateAsync:createProduct}=useCreateProduct();
    const categories=['foods','drinks','services','others'];

    const onSubmit=async (data)=>{
        try{
            await createProduct(data);
            setToast({isOpen:true,status:'success',message:'Product created succesfully'});
        }catch(error){
            setToast({isOpen:true,status:'danger',message:error.message});
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className='flex flex-col space-y-2'>
                <span>Name:</span>
                <input {...register('name',{required:true,minLength:{value:2,message:'A product name should contain atleast 2 characters'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.name?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Price:</span>
                <input type='number' {...register('price',{required:true,min:{value:0,message:'Price cannot be below 0'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.price?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Stock:</span>
                <input type='number' {...register('stock',{required:true,min:{value:0,message:'Stock cannot be below 0'}})} className='input'/>
                <p className='text-danger text-xs font-thin'>{errors.stock?.message}</p>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Category:</span>
                <select {...register('category',{required:true})} className='input'>
                    <option value=''>Select Category</option>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <p className='text-danger font-thin text-xs'>{errors.category?.message}</p>
            </label>

            <Button type='submit' color1='primary' color2='primary-dark'>Add Product</Button>
        </form>
    )
}

const AddSale=({setToast})=>{
    const[cart,setCart]=useState([]);
    const[currentItem,setCurrentItem]=useState({id:'',name:'',price:0,quantity:1});
    const[paymentMethod,setPaymentMethod]=useState('');
    const {data,isLoading,isError,error}=useGetAllProducts();
    const {mutateAsync:createSale}=useCreateSale();
    const paymentMethods=['cash','card','mobile','transfer'];
    const navigate=useNavigate();

    const addToCart=()=>{
        if(!currentItem.id) return;
        setCart(prev=>[...prev,{product:currentItem.id,productName:currentItem.name,price:currentItem.price,quantity:currentItem.quantity}]);
        setCurrentItem({id:'',name:'',price:0,quantity:1});
    };

    const removeFromCart=(name)=>setCart(prev=>prev.filter(i=>i.productName!==name));

    const grandTotal=cart.reduce((acc,c)=>acc+(c.price*c.quantity),0);

    if(isLoading) return <div className='flex items-center justify-center'><div className='h-12 w-12 animate-spin rounded-full border-t-2 border-primary-dark'></div><p>Loading products...</p></div>;
    if(isError) return <div className='text-danger text-center'>Oops! {error.message}</div>;

    const onSubmit=async (e)=>{
        e.preventDefault();
        try{
            await createSale({items:cart,paymentMethod,totalPrice:grandTotal});
            setToast({isOpen:true,status:'success',message:'Sale created succesfully'});
            navigate(-1);
        }catch(err){
            setToast({isOpen:true,status:'danger',message:err.message});
        }
    };

    return(
        <form onSubmit={onSubmit}>
            <label className='flex flex-col space-y-2'>
                <span>Item(s):</span>
                <select className='input' value={currentItem.id} onChange={e=>{
                    const p=data?.products?.find(x=>x._id===e.target.value);
                    if(p) setCurrentItem({id:p._id,name:p.name,price:p.price,quantity:1});
                }}>
                    <option value=''>Select an item</option>
                    {data?.products?.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
            </label>

            <label className='flex flex-col space-y-2'>
                <span>Quantity:</span>
                <input type='number' min='1' className='input' value={currentItem.quantity} onChange={e=>setCurrentItem(prev=>({...prev,quantity:+e.target.value}))}/>
            </label>

            <Button type='button' onClick={addToCart} color1='primary' color2='primary-dark'>Add to Cart</Button>

            <h1 className='font-semibold mt-4'>Sale items:</h1>
            <Table headers={['product','price','quantity','subtotal','action']}>
                {cart.map(item=>(
                    <tr key={item.productName}>
                        <td className='px-4 py-1 text-gray'>{item.productName}</td>
                        <td className='px-4 py-1 text-gray'>{item.price}</td>
                        <td className='px-4 py-1 text-gray'>{item.quantity}</td>
                        <td className='px-4 py-1 text-gray'>{item.price*item.quantity}</td>
                        <td><Button onClick={()=>removeFromCart(item.productName)}><FaTrash size={20}/></Button></td>
                    </tr>
                ))}
            </Table>

            <label className='flex flex-col space-y-2 mt-4'>
                <span>Payment Method:</span>
                <select className='input' value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} required>
                    <option value=''>Select Payment Method</option>
                    {paymentMethods.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
            </label>

            <h1 className='font-semibold text-xl mt-4'>GRAND TOTAL: {grandTotal} Tshs</h1>
            <Button type='submit' color1='primary' color2='primary-dark'>Complete Sale</Button>
        </form>
    )
};

export default function Add({type}){
    const navigate=useNavigate();
    const {setToast}=useOutletContext();

    const content=type==='sale'?<AddSale setToast={setToast}/>:
                 type==='banking'?<AddBanking setToast={setToast}/>:
                 type==='expense'?<AddExpense setToast={setToast}/>:
                 type==='product'?<AddProduct setToast={setToast}/>:
                 <AddUser setToast={setToast}/>;

    return <Modal title={`Add ${type}`} onClose={()=>navigate(-1)}>{content}</Modal>;
}