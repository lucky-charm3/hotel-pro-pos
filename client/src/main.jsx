import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider,createBrowserRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MoneyManagement,NotFound,View,Edit,Add,Delete,Print,
                 ProductsManagement,ReportsManagement,
                 ExpenseManagement,BankingManagement,AccountManagement,
                 SalesManagement,UsersManagement,Login,
                 ProtectedRoute,Dashboard,MainRoute,ErrorPage} from './pages';

const client=new QueryClient({
  defaultOptions:{
    staleTime:1000*60*5,
    cacheTime:1000*60*10,
    retry:1
  }
});

const router=createBrowserRouter([
  {
   path:'/',
   element:<App/>,
   errorElement:<ErrorPage/>,
   children:[
    {
      index:true,
      element:<Login/>
    },
    {
      path:'mainRoute',
      element:<ProtectedRoute allowedRoles={['admin','cashier','manager']}>
               <MainRoute/>
      </ProtectedRoute>,
      children:[
           {
              index:true,
              element:<Dashboard/>
            },
            {
              path:'salesManagement',
              children:[
              {index:true,element:<SalesManagement/>},
              {path:':id/view',element:<View type='sale'/>},
              {path:':id/edit',element:<Edit type='sale'/>},
              {path:'add',element:<Add type='sale'/>},
              {path:':id/print',element:<Print type='sale'/>},
              {path:':id/delete',element:<Delete type='sale'/>}
              ]
            },
            {
              path:'moneyManagement',
              element:<ProtectedRoute allowedRoles={['admin','manager']}>
                <MoneyManagement/>
              </ProtectedRoute>,
              children:[
                { 
                  index: true,
                  element: <>
                                <ExpenseManagement/>
                                <BankingManagement/>
                                </> 
                                },
                {
                  path:'expenses',
                  element:<ExpenseManagement/>,
                  children:[
                    {path:':id/view',element:<View type='expense'/>},
                    {path:':id/edit',element:<Edit type='expense'/>},
                    {path:'add',element:<Add type='expense'/>},
                    {path:':id/delete',element:<Delete type='expense'/>}
                  ]
                },
                {
                  path:'banking',
                  element:<BankingManagement/>,
                  children:[
                    {path:':id/view',element:<View type='banking'/>},
                    {path:':id/edit',element:<Edit type='banking'/>},
                    {path:'add',element:<Add type='banking'/>},
                    {path:':id/delete',element:<Delete type='banking'/>}
                  ]
                }
              ]
            },
            {
              path:'reportsManagement',
              element:<ReportsManagement/>,
              children:[
               {path:':id/view',element:<View type='report'/>},
               {path:':id/print',element:<Print type='report'/>},
               {path:':id/delete',element:<Delete type='report'/>}
              ]
            },
            {
              path:'accountManagement',
              element:<AccountManagement/>
            },
            {
              path:'usersManagement',
              element:<UsersManagement/>,
              children:[
                {path:':id/view',element:<View type='user'/>},
                {path:':id/edit',element:<Edit type='user'/>},
                {path:'add',element:<Add type='user'/>},
                {path:':id/delete',element:<Delete type='user'/>}
              ]
            },
            {
              path:'productsManagement',
              element:<ProductsManagement/>,
              children:[
                {path:':id/view',element:<View type='product'/>},
                {path:':id/edit',element:<Edit type='product'/>},
                {path:'add',element:<Add type='product'/>},
                {path:':id/delete',element:<Delete type='product'/>}
              ]
            }
      ]
    },
    {
      path:'*',
      element:<NotFound/>
    }
]
  },
])

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
  </QueryClientProvider>
  ,
)
