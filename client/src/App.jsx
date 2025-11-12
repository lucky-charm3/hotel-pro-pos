import {AuthProvider} from './contexts/authProvider.jsx';

import {Outlet} from 'react-router-dom'
export default function App()
{
  return(
<AuthProvider>
<Outlet/>
</AuthProvider>
  )
}