import Modal from './modal.jsx';
import {useAuth} from '../contexts/authContext.jsx';
import Button from '../UI/button.jsx';

export default function LogoutConfirmation({isOpen,setIsOpen})
{
    const {user,logout}=useAuth();

    const onLogout=()=>{
      logout();
    }
    
    if (!isOpen) return null;
    
    return(
        <Modal title='Logout Confirmation' onClose={()=>setIsOpen(false)}>
      <p>{user.username}, we shall miss you! Are you really
         sure you want to logout?</p>
         <div className='flex justify-center space-x-5 mt-5'>
         <Button onClick={()=>setIsOpen(false)} color1='primary' color2='primary-dark'>
            Cancel
         </Button>
         <Button onClick={onLogout} color1='primary' color2='primary-dark'>
            Yes,Logout
         </Button>
         </div>
        </Modal>
    )
}