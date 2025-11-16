import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useAuth} from '../contexts/authContext.jsx';
import {useOutletContext} from 'react-router-dom';
import {useUpdateProfile} from '../hooks/userQuery.js';
import Input from '../UI/input.jsx';
import Button from '../UI/button.jsx';

export default function AccountManagement()
{
    const{register,formState:{errors},reset,handleSubmit}=useForm({mode:'onChange'})

    const {user,loading:authLoading}=useAuth();

    useEffect(()=>{
        reset({
            username:user?.username,
            password:user?.password,
            email:user?.email,
            role:user?.role,
            phone:user?.phone

        })
    },[reset,user])

    const{setToast}=useOutletContext();

    const {mutateAsync:updateProfile}=useUpdateProfile();

    const onSubmit=async (formData)=>{
        try{
        await updateProfile(formData)
        setToast(prev=>({...prev,
                                                    isOpen:true,
                                                    status:'success',
                                                    message:'Account updated succesfully'
                                                }))
        }
        catch(error)
        {
            setToast(prev=>({...prev,
                                                    isOpen:true,
                                                    status:'danger',
                                                    message:error.message}))
        }
    }

    if(authLoading)
    {
        return(
            <div className='flex items-center justify-center h-screen'>Loading...</div>
        )
    }

    return(
        <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-3xl font-bold mb-6 text-primary-dark font-apple">Account Management</h1>
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
            <span>Role:</span>
            <input  {...register('role'
        )}
        className='input'
        readOnly
        />
        </label>



            <Button 
            color1='primary'  
            color2='primary-dark' 
            onClick={handleSubmit} 
            type='submit'>
                Update Profile
            </Button>

        </form>
    )
}