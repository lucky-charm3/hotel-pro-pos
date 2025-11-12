import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import Input from '../UI/input.jsx';
import Button from '../UI/button.jsx';

export default function Login() {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [isShowPassword,setIsShowPassword]=useState(true)
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/mainRoute');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/newdf.png" alt="New DF Hotel Logo" className="h-16 w-16 rounded-full" />
        </div>
        <h1 className="text-3xl font-bold text-dark font-apple mb-6 text-center">New DF Hotel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray mb-1">
              Username
            </label>
            <Input
              value={credentials.name}
              onChange={handleChange}
              placeholder="Enter your username"
              name="name"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray mb-1">
              Password
            </label>
            <div className='relative'>
            <Input
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              name="password"
              type={isShowPassword?"password":"text"}
            />
               <button type='button' className='absolute p-1 right-4 top-1'
            onClick={()=>setIsShowPassword(!isShowPassword)}>
           {isShowPassword?<FaEye size={22}/>:<FaEyeSlash size={22}/>}
            </button>
            </div>
          </div>
          {error && (
            <div className="text-danger text-sm text-center">{error}</div>
          )}
          <Button
            type='submit'
            color1="primary"
            color2="primary-dark"
            disabled={loading || !credentials.name || !credentials.password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}