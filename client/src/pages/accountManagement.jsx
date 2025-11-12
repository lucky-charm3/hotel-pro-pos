import {useState} from 'react';
import {useAuth} from '../contexts/authContext.jsx';
import {useUpdateProfile} from '../hooks/userQuery.js';
import Input from '../UI/input.jsx';
import Button from '../UI/button.jsx';

export default function AccountManagement()
{
    const [formData,setFormData]=useState({username:'',
                                                                                            password:'',email:'',
                                                                                            phone:'',});

    const {user,loading:authLoading}=useAuth();

    const {mutate:updateProfile}=useUpdateProfile();

    const handleInput=(e)=>{
        const {name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}))
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        updateProfile(formData);
    }

    if(authLoading)
    {
        return(
            <div className='flex items-center justify-center h-screen'>Loading...</div>
        )
    }

    return(
        <section className='flex flex-col gap-6'>
            <h1 className="text-3xl font-bold mb-6 text-primary-dark font-apple">Account Management</h1>
            <label className='flex flex-col gap-3'>
                <span className='font-semibold text-lg'>Username:</span>
                <Input 
                type='text' 
                value={user.username}
                name='username'
                onChange={handleInput}
                />
            </label>

             <label className='flex flex-col gap-3'>
                <span className='font-semibold text-lg'>Email:</span>
                <Input 
                type='email' 
                value={user.email}
                name='email'
                onChange={handleInput}
                />
            </label>

             <label className='flex flex-col gap-3'>
                <span className='font-semibold text-lg'>Phone Number:</span>
                <Input 
                type='text' 
                value={user.phone}
                name='phone'
                onChange={handleInput}
                />
            </label>

             <label className='flex flex-col gap-3'>
                <span className='font-semibold text-lg'>Password:</span>
                <Input 
                type='password' 
                value={user.password}
                name='password'
                onChange={handleInput}
                />
            </label>

             <label className='flex flex-col gap-3'>
                <span className='font-semibold text-lg'>Role:</span>
                <input 
                type='text' 
                value={user.role}
                className=' rounded-xl px-4 py-2 mb-3 border
                 focus:outline-none focus:ring-2 focus:ring-primary
                 transition duration-300 w-full'
                readOnly
                />
            </label>

            <Button 
            color1='primary'  
            color2='primary-dark' 
            onClick={handleSubmit} 
            type='button'>
                Update Profile
            </Button>

        </section>
    )
}