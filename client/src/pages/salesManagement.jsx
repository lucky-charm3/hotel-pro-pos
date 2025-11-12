import { useState, useRef} from 'react';
import { useSearchParams, useNavigate,Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useGetAllSales, useGetCashierSales } from '../hooks/saleQuery';
import Table from '../sharedComponents/table.jsx';
import Button from '../UI/button.jsx';
import Input from '../UI/input.jsx';
import ActionsDropdown from '../modals/actionDropdown.jsx';
import Pagination from '../sharedComponents/pagination.jsx';
import { format } from 'date-fns';

function SaleRow({ sale, isAdmin, isManager, isCashier, isAdminOrManager }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  const actions = [];
  if (isAdmin || isManager || isCashier) {
    actions.push({
      type:'view',
      label: 'View',
      onClick: () => navigate(`/mainRoute/salesManagement/${sale._id}/view`),
    });
  }

  if (isAdmin) {
    actions.push({
      type:'delete',
      label: 'Delete',
      onClick: () => navigate(`/mainRoute/salesManagement/${sale._id}/delete`),
    });
  }

  if (isCashier) {
    actions.push({
      type:'print',
      label: 'Print',
      onClick: () =>navigate(`/mainRoute/salesManagement/${sale._id}/print`)
    });
  }

  return (
    <tr className="border-b border-light-gray hover:bg-light">
      <td className="px-6 py-4 text-gray">
        {sale.items?.map((item) => item.productName).join(', ') || 'N/A'}
      </td>
      {isAdminOrManager && (
        <td className="px-6 py-4 text-gray">
          {sale.cashier.username || 'Unknown'}
        </td>
      )}
      <td className="px-6 py-2 md:py-4 text-gray">
        Tshs{parseFloat(sale.totalPrice).toFixed(2)}
      </td>
      <td className="px-6 py-2 md:py-4 text-gray">
        {sale.paymentMethod || 'N/A'}
      </td>
      <td className="px-6 py-2 md:py-4 text-gray">
        {sale.createdAt ? format(new Date(sale.createdAt), 'MM/dd/yyyy') : 'N/A'}
      </td>
      <td className="px-6 py-2 md:py-4 text-gray relative">
        <ActionsDropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          actions={actions}
          triggerRef={triggerRef}
        />
      </td>
    </tr>
  );
}

export default function SalesManagement() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 15;

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isCashier = user?.role === 'cashier';
  const isAdminOrManager = isAdmin || isManager;

  const today = format(new Date(), 'yyyy-MM-dd');
  const queryParams = { search, limit, page };

 const { data: allSalesData, isLoading: allLoading, error: allSalesError } = useGetAllSales({
  ...queryParams,
  enabled: isAdminOrManager,  
});

const { data: cashierSalesData, isLoading: cashierLoading, error: cashierSalesError } = useGetCashierSales({
  ...queryParams,
  start_date: today,
  end_date: today,
  enabled: isCashier,  
});

if (allSalesError || cashierSalesError) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-danger">
        Error loading sales: {allSalesError?.message || cashierSalesError?.message}
      </div>
    </div>
  );
}

 const salesData = isCashier ? cashierSalesData : allSalesData;
const isLoading = isCashier ? cashierLoading : allLoading;
  const totalPages = Math.ceil(salesData?.length / limit);

  const handleSearchChange = (e) => {
    setSearchParams({ search: e.target.value, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ search, page: newPage.toString() });
  };
 

  return (
    <div className="p-6 bg-light min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary-dark font-apple">Sales Management</h1>
      
      <div className="flex 
       items-center mb-6 space-x-3">
        {isAdminOrManager&&<Input
           type='search'
           value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or payment method"
        />
}

        <Button
          type='button'
          color1="primary"
          color2="primary-dark"
          onClick={() => navigate('/mainRoute/salesManagement/add')}
        >
          Add New Sale
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <Table
  headers={
    isAdminOrManager
      ? ['Items', 'Created By', 'Total Price', 'Payment Method', 'Date', 'Actions']
      : ['Items', 'Total Price', 'Payment Method', 'Date', 'Actions']
  }
>
  {(isLoading||authLoading) ? (
    <tr>
      <td colSpan={isAdminOrManager ? 6 : 5} className="text-center py-8">
        <div className="flex justify-center items-center">
          <div className="h-12 w-12 rounded-full border-primary-dark border-2 animate-spin"></div>
          <span className="ml-2">Loading sales...</span>
        </div>
      </td>
    </tr>
  ) : (
    salesData.sales?.map((sale) => (
      <SaleRow
        key={sale._id}
        sale={sale}
        isAdmin={isAdmin}
        isManager={isManager}
        isCashier={isCashier}
        isAdminOrManager={isAdminOrManager}
      />
    ))
  )}
</Table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages||1}
        onPageChange={handlePageChange}
      />
      <Outlet/>
    </div>
  );
}