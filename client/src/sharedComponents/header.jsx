import { useAuth } from '../contexts/authContext.jsx';

export default function Header() {
  const { user } = useAuth();

  const getRoleDisplay = (role) => {
    const roles = {
      admin: 'Administrator',
      manager: 'Manager',
      cashier: 'Cashier'
    };
    return roles[role] || role;
  };

  return (
    <header className="bg-white shadow-md  border-gray-200 rounded-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h1 className="ml-2 text-xl font-semibold text-gray-800">
            {getRoleDisplay(user?.role)} Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{user?.username}</div>
              <div className="text-xs text-gray-500">{getRoleDisplay(user?.role)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}