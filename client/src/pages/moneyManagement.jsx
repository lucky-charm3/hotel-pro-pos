import {Outlet,useOutletContext} from 'react-router-dom';

export default function MoneyManagement()
{
  return(
    <div>
      <h1 className='text-3xl font-semibold text-primary-dark '>Money Management</h1>
      <div>
      <Outlet context={useOutletContext()}/>
      </div>
    </div>
  )
}