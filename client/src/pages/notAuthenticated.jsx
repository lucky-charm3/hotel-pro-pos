import Button from '../UI/button.jsx';
import {useNavigate} from 'react-router-dom';

export default function NotAutheticated()
{
    const navigate=useNavigate();

    return(
        <div className='p-4 h-screen text-primary-dark flex flex-col space-y-6 justify-center items-center'>
            <h1 className='font-extrabold text-4xl tracking-wider'>
                401 Unauthenticated!
                </h1>
           <p className='text-xl font-semibold'> Dear beautiful user, 
Access denied , it seems you’re not logged in yet.</p>
<p className='text-xl font-semibold'>Let’s fix that and get you where the magic happens.
Please sign in to continue your journey. </p>
<Button onClick={()=>navigate('/')} color1='primary' color2='primary-dark'>
Login
</Button>
        </div>
    )
}