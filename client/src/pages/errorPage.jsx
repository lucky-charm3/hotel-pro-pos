import {useRouteError} from 'react-router-dom';

export default function ErrorPage()
{
    const error=useRouteError();

    return(
        <div className='h-screen text-primary-dark flex flex-col space-y-6 justify-center items-center'>
<h1 className='font-extrabold text-4xl tracking-wider'>
               Awww!, Oops,<br/> An Error Just Occured!
                </h1>
                <p className='text-xl font-semibold'>{error.message}</p>
                </div>
    )
}