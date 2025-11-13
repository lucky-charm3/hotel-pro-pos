import {useEffect} from 'react';

export default function Toast({toast,setToast}){
    
    useEffect(()=>{
        if(toast?.isOpen){
            const t=setTimeout(()=>setToast(prev=>({...prev,isOpen:false})),3000);
            return ()=>clearTimeout(t);
        }
    },[toast?.isOpen,setToast]);

    if(!toast?.isOpen) return null;

    return(
        <div className={`fixed inset-x-0 top-4 left-1/2 -translate-x-1/2 
        px-6 py-3 rounded-lg bg-${toast.status==='success'?'success':'danger'} text-white text-center z-[9999] transition-transform duration-500 ${toast.isOpen?'translate-y-0':'-translate-y-full'}`}>
            <p className='text-lg'>{toast.message}</p>
        </div>
    )
}