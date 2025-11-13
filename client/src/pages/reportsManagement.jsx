import { useState, useRef } from 'react';
import { useAuth } from '../contexts/authContext.jsx';
import { useNavigate, Outlet, useSearchParams, useOutletContext } from 'react-router-dom';
import { useGetAllReports, useGenerateReport } from '../hooks/reportQuery.js';
import Button from '../UI/button.jsx';
import Table from '../sharedComponents/table.jsx';
import Pagination from '../sharedComponents/pagination.jsx';
import ActionDropdown from '../modals/actionDropdown.jsx';

function ReportRow({ report, isAdminOrManager }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const actions = [
        {
            type: 'view',
            label: 'View',
            onClick: () => navigate(`/mainRoute/reportsManagement/${report._id}/view`)
        },
        {
            type: 'print',
            label: 'Print',
            onClick: () => navigate(`/mainRoute/reportsManagement/${report._id}/print`)
        }
    ];

    // Add edit/delete only for admins/managers
    if (isAdminOrManager) {
        actions.splice(1, 0, { // Add edit at position 1
            type: 'edit',
            label: 'Edit', 
            onClick: () => navigate(`/mainRoute/reportsManagement/${report._id}/edit`)
        });
        actions.push({
            type: 'delete',
            label: 'Delete',
            onClick: () => navigate(`/mainRoute/reportsManagement/${report._id}/delete`)
        });
    }

    return (
        <tr className='border-b border-light-gray hover:bg-light'>
            <td className='px-6 py-2 text-gray'>
                {new Date(report.startDate).toLocaleDateString()}
            </td>
            <td className='px-6 py-2 text-gray'>
                {new Date(report.endDate).toLocaleDateString()}
            </td>
            <td className='px-6 py-2 text-gray'>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    report.type === 'sales' ? 'bg-green-100 text-green-800' :
                    report.type === 'expenses' ? 'bg-red-100 text-red-800' :
                    report.type === 'banking' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                }`}>
                    {report.type.toUpperCase()}
                </span>
            </td>
            {isAdminOrManager && (
                <td className='px-6 py-2 text-gray'>
                    {report.generatedBy?.username || 'System'}
                </td>
            )}
            <td className='px-6 py-2'>
                <ActionDropdown
                    actions={actions}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    triggerRef={triggerRef}
                />
            </td>
        </tr>
    );
}

export default function ReportsManagement() {
    const { user, loading: authLoading } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || 1);
    const { setToast } = useOutletContext();
    
    // STATE FOR REPORT PARAMETERS
    const [reportType, setReportType] = useState('sales');
    const [dateRange, setDateRange] = useState('today');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const { data, isLoading, refetch } = useGetAllReports({ page });
    const { mutate: generateReport, isPending: isGenerating } = useGenerateReport();

    const handleGenerateReport = () => {
        const reportData = {
            type: reportType,
            dateRange: dateRange
        };

        if (dateRange === 'custom' && customStartDate && customEndDate) {
            reportData.startDate = customStartDate;
            reportData.endDate = customEndDate;
        }

        console.log('Sending report data:', reportData); 

        generateReport(reportData, {
            onSuccess: (data) => {
                console.log('Report generated successfully:', data);
                refetch();
                
                setToast({
                    isOpen: true,
                    status: 'success',
                    message: `Report generated successfully!`
                });
            },
            onError: (error) => {
                console.error('Failed to generate report:', error);
                setToast({
                    isOpen: true,
                    status: 'danger',
                    message: error.response?.data?.message || 'Failed to generate report'
                });
            }
        });
    };

    const headers = (user.role === 'admin' || user.role === 'manager') ?
        ['startDate', 'endDate', 'type', 'generatedBy', 'actions'] :
        ['startDate', 'endDate', 'type', 'actions'];

    const handlePageChange = (newPage) => {
        setSearchParams(prev => ({ ...prev, page: newPage }));
    };

    if (isLoading || authLoading) {
        return (
            <div className='h-screen flex items-center justify-center'>Loading...</div>
        );
    }

    return (
        <div className='flex flex-col gap-2 text-lg'>
            <h1 className="text-3xl font-bold mb-6 text-primary-dark font-apple">Report Management</h1> 
            
            <div className='flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md mb-6'>
                <label className='flex flex-col gap-2'>
                    <span className='font-semibold'>Report type:</span>
                    <select 
                        className='rounded-xl px-6 py-3 border'
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        {['sales', 'products', 'expenses', 'banking'].map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                        ))}
                    </select>
                </label>

                <label className='flex flex-col gap-2'>
                    <span className='font-semibold'>Date Range:</span>
                    <select 
                        className='rounded-xl px-6 py-3 border'
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        {['today', 'this week', 'this month', 'custom'].map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}
                    </select>
                </label>

                {dateRange === 'custom' && (
                    <div className='grid grid-cols-2 gap-4'>
                        <label className='flex flex-col gap-2'>
                            <span className='font-semibold'>Start Date:</span>
                            <input
                                type="date"
                                className='rounded-xl px-6 py-3 border'
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                        </label>
                        <label className='flex flex-col gap-2'>
                            <span className='font-semibold'>End Date:</span>
                            <input
                                type="date"
                                className='rounded-xl px-6 py-3 border'
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    color1='primary' 
                    color2='primary-dark'
                >
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
            </div>

            <Table headers={headers}>
                {data?.reports?.map(r => (
                    <ReportRow 
                        key={r._id}
                        isAdminOrManager={user.role === 'admin' || user.role === 'manager'}
                        report={r}
                    />
                ))}
            </Table>

            <Pagination 
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePageChange}
            />
            
            <Outlet/>
        </div>
    );
}