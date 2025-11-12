import {useState,useRef} from 'react';
import {useAuth} from '../contexts/authContext.jsx';
import {useNavigate,Outlet,useSearchParams} from 'react-router-dom';
import {useGetAllReports,useGenerateReport} from '../hooks/reportQuery.js';
import Button from '../UI/button.jsx';
import Table from '../sharedComponents/table.jsx';
import Pagination from '../sharedComponents/pagination.jsx';
import ActionDropdown from '../modals/actionDropdown.jsx';

function ReportRow({report,isAdminOrManager})
{
    const navigate=useNavigate()

    const[isOpen,setIsOpen]=useState(false);
    const triggerRef=useRef(null);

    const actions=[
          {
            type:'view',
            label:'View',
            onClick:navigate(`/mainRoute/reportsManagement/${report._id}/view`)
        },
          {
            type:'edit',
            label:'Edit',
            onClick:navigate(`/mainRoute/reportsManagement/${report._id}/edit`)
        },
          {
            type:'delete',
            label:'Delete',
            onClick:()=>navigate(`/mainRoute/reportsManagement/${report._id}/delete`)
        },
          {
            type:'print',
            label:'Print',
            onClick:window.print()
        }
    ]

return(
    <tr className='border-b border-light-gray hover:bg-light'>
        <td className='px-6 py-2 text-gray'>{report.startDate}</td>
        <td className='px-6 py-2 text-gray'>{report.endDate}</td>
        <td className='px-6 py-2 text-gray'>{report.type}</td>
        {isAdminOrManager&&<td className='px-6 py-2'>{report.generatedBy}</td>}
        <td className='px-6 py-2'>
            <ActionDropdown
            actions={actions}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            />
        </td>
    </tr>
)
}

export default function ReportsManagement()
{
    const {user,loading:authLoading}=useAuth();

    const [searchParams,setSearchParams]=useSearchParams();
    const page=parseInt(searchParams.get('page')||1);

    const{data,isLoading}=useGetAllReports({page})

    const {mutate:generateReport}=useGenerateReport()

    const headers=(user.role==='admin'||user.role==='manager')?
                                        ['startDate','endDate','type','generatedBy','actions']:
                                        ['startDate','endDate','type','actions']

    const handlePageChange=(newPage)=>{
        setSearchParams(prev=>({...prev,page:newPage}))
    }

       if(isLoading||authLoading)
       {
           return(
               <div className='h-screen flex items-center justify-center'>Loading...</div>
           )
       }
                                        
    return(
        <div className='flex flex-col gap-2 text-lg'>
            <h1 className="text-3xl font-bold mb-6 text-primary-dark font-apple">Report Management</h1> 
            <div className='flex flex-col gap-4'>
                <label className='flex flex-col gap-2'>
                    <span className='font-semibold '>Report type:</span>
                    <select className='rounded-xl px-6 py-3 border'>
                        {['sales', 'products', 'expenses', 'banking'].map((t,i)=>(
                            <option key={i} value={t}>{t}</option>
                        ))
                    }
                        </select>
                </label>

                <label className='flex flex-col gap-2'>
                    <span className='font-semibold '>Date Range:</span>
                    <select className='rounded-xl px-6 py-3 border'>
                        {['today', 'this week', 'this month'].map((d,i)=>(
                            <option key={i} value={d}>{d}</option>
                        ))
                    }
                        </select>
                </label>

                <Button onClick={generateReport}
                color1='primary' 
                color2='primary-dark'>Generate Report</Button>
            </div>


            <Table headers={headers}>
                {data.reports.map(r=>(
                    <ReportRow key={r._id}
                    isAdminOrManager={user.role==='admin'||user.role==='manager'}
                    report={r}
                    />
                ))}
            </Table>

            <Pagination currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            />
            
            <Outlet/>
        </div>
    )
}