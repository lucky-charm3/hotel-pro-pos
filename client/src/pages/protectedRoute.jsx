import {useAuth} from '../contexts/authContext.jsx';
import NotAuthenticated from './notAuthenticated.jsx';
import NotAuthorized from './notAuthorized.jsx';

export default function ProtectedRoute({allowedRoles,children})
{
const {user,loading}=useAuth();

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

   if (!user) {
    return <NotAuthenticated/>
  }

if(!allowedRoles.includes(user.role))
{
    return <NotAuthorized/>
}
return children;
}