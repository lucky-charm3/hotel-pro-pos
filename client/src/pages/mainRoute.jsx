
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../sharedComponents/header.jsx';
import Sidebar from '../sharedComponents/sidebar.jsx';
import Toast from '../modals/toast.jsx';

export default function MainRoute()
{
const[toast,setToast]=useState({isOpen:false,status:'',message:''})

    return(
        <div className="flex h-screen bg-light">
              <Sidebar/>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header/>
                
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  <Outlet context={{setToast}}/>
                  <Toast toast={toast} setToast={setToast}/>
                </main>
              </div>
            </div>
    )
}