import {useState} from  'react';
import {FaBars} from 'react-icons/fa';
import LogoutConfirmation from '../modals/logoutConfirmation.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.jsx';

const menuItems = {
  admin: [
    { path: '/mainRoute', icon: 'fa-home', label: 'Dashboard' },
    { path: '/mainRoute/salesManagement', icon: 'fa-cash-register', label: 'Sales Management' },
    { path: '/mainRoute/moneyManagement', icon: 'fa-money-bill-wave', label: 'Money Management' },
    { path: '/mainRoute/reportsManagement', icon: 'fa-chart-bar', label: 'Reports' },
    { path: '/mainRoute/accountManagement', icon: 'fa-user-cog', label: 'Account' },
    { path: '/mainRoute/usersManagement', icon: 'fa-users-cog', label: 'Manage Users' },
    { path: '/mainRoute/productsManagement', icon: 'fa-barcode', label: 'Product Management' },
  ],

  manager: [
    { path: '/mainRoute', icon: 'fa-home', label: 'Dashboard' },
    { path: '/mainRoute/salesManagement', icon: 'fa-cash-register', label: 'Sales Management' },
    { path: '/mainRoute/moneyManagement', icon: 'fa-money-bill-wave', label: 'Money Management' },
    { path: '/mainRoute/reportsManagement', icon: 'fa-chart-bar', label: 'Reports' },
    { path: '/mainRoute/accountManagement', icon: 'fa-user-cog', label: 'Account' },
    { path: '/mainRoute/usersManagement', icon: 'fa-users-cog', label: 'Manage Users' },
    { path: '/mainRoute/productsManagement', icon: 'fa-barcode', label: 'Product Management' },
  ],

  cashier: [
    { path: '/mainRoute', icon: 'fa-home', label: 'Dashboard' },
    { path: '/mainRoute/salesManagement', icon: 'fa-cash-register', label: 'Sales Management' },
    { path: '/mainRoute/reportsManagement', icon: 'fa-chart-bar', label: 'Reports' },
    { path: '/mainRoute/accountManagement', icon: 'fa-user-cog', label: 'Account' },
  ]
};

export default function Sidebar() {
  const [isLogoutModalOpen,setIsLogoutModalOpen]=useState(false)
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const { user} = useAuth();
  const location = useLocation();

  const userMenuItems = menuItems[user?.role] || [];

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <>
  <LogoutConfirmation isOpen={isLogoutModalOpen}
  setIsOpen={setIsLogoutModalOpen}
  />
   
      <button className='bg-primary rounded-lg p-3 text-white text-bold fixed z-40 top-2 left-5 lg:hidden'
      onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
   <FaBars size={22}/>
      </button>
   

      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-primary transform transition-transform 
        duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-primary-dark">
          <i className="fas fa-hotel text-2xl text-white mr-3"></i>
          <h2 className="text-white text-xl font-bold">New DF Hotel POS</h2>
        </div>
        
        <nav className="mt-8">
          {userMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-white transition-colors duration-200 hover:bg-primary-dark hover:bg-opacity-10 border-l-4 ${
                location.pathname === item.path 
                  ? 'bg-primary-dark bg-opacity-10 border-secondary' 
                  : 'border-transparent'
              }`}
            >
              <i className={`fas ${item.icon} mr-3`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-white transition-colors duration-200 hover:bg-black hover:bg-opacity-10 border-l-4 border-transparent mt-4"
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}