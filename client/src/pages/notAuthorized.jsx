import Button from '../UI/button.jsx';
import { useNavigate } from 'react-router-dom';

export default function NotAuthorized() {
    const navigate = useNavigate();

    return (
        <div className='p-4 h-screen text-primary-dark flex flex-col space-y-6 justify-center items-center'>
            <h1 className='font-extrabold text-4xl tracking-wider'>
                403 Not Authorized!
            </h1>
            <p className='text-xl font-semibold'>
                Dear beautiful user, it seems you don’t have permission to access this page.
            </p>
            <p className='text-xl font-semibold'>
                Let’s guide you back safely. You can return back or contact admin if this seems wrong.
            </p>
            <Button onClick={() => navigate('/mainRoute')} color1='primary' color2='primary-dark'>
                Go Back
            </Button>
        </div>
    );
}
