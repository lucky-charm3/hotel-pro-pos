import { useAuth } from '../contexts/authContext';
import { useGetDashboard } from '../hooks/dashboardQuery';
import StatCard from '../sharedComponents/statCard';
import { FaDollarSign, FaShoppingCart, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: dashboard, isLoading: dashboardLoading, error } = useGetDashboard();

  const isLoading = authLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Failed to load dashboard data</div>
      </div>
    );
  }

  const {
    sales = { today: 0, week: 0, month: 0 },
    expenses = { today: 0, week: 0, month: 0 },
    banking = { totals: { deposits: 0, withdrawals: 0, transfers: 0, net: 0 } },
    netIncome = { today: 0, week: 0, month: 0 },
    products = 0,
    users = 0
  } = dashboard || {};

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  const formatCurrency = (amount) => `Tshs${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary-dark">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(sales.today)}
          icon={<FaDollarSign />}
          color="success"
        />

        {isAdminOrManager ? (
          <>
            <StatCard
              title="This Week's Sales"
              value={formatCurrency(sales.week)}
              icon={<FaDollarSign />}
              color="success"
            />
            <StatCard
              title="This Month's Sales"
              value={formatCurrency(sales.month)}
              icon={<FaDollarSign />}
              color="success"
            />

            <StatCard
              title="Today's Expenses"
              value={formatCurrency(expenses.today)}
              icon={<FaMoneyBillWave />}
              color="danger"
            />
            <StatCard
              title="This Week's Expenses"
              value={formatCurrency(expenses.week)}
              icon={<FaMoneyBillWave />}
              color="danger"
            />
            <StatCard
              title="This Month's Expenses"
              value={formatCurrency(expenses.month)}
              icon={<FaMoneyBillWave />}
              color="danger"
            />

            <StatCard
              title="Total Deposits"
              value={formatCurrency(banking.totals.deposits)}
              icon={<FaDollarSign />}
              color="info"
            />
            <StatCard
              title="Total Withdrawals"
              value={formatCurrency(banking.totals.withdrawals)}
              icon={<FaMoneyBillWave />}
              color="warning"
            />
            <StatCard
              title="Net Banking"
              value={formatCurrency(banking.totals.net)}
              icon={<FaChartLine />}
              color={banking.totals.net >= 0 ? "success" : "danger"}
            />

            <StatCard
              title="Today's Net Income"
              value={formatCurrency(netIncome.today)}
              icon={<FaChartLine />}
              color={netIncome.today >= 0 ? "success" : "danger"}
            />
            <StatCard
              title="This Week's Net Income"
              value={formatCurrency(netIncome.week)}
              icon={<FaChartLine />}
              color={netIncome.week >= 0 ? "success" : "danger"}
            />
            <StatCard
              title="This Month's Net Income"
              value={formatCurrency(netIncome.month)}
              icon={<FaChartLine />}
              color={netIncome.month >= 0 ? "success" : "danger"}
            />

            <StatCard
              title="Total Products"
              value={products}
              icon={<FaShoppingCart />}
              color="info"
            />
            <StatCard
              title="Total Users"
              value={users}
              icon={<FaUsers />}
              color="info"
            />
          </>
        ) : (
          <>
            <StatCard
              title="This Week's Sales"
              value={formatCurrency(sales.week)}
              icon={<FaDollarSign />}
              color="success"
            />
            <StatCard
              title="Total Products"
              value={products}
              icon={<FaShoppingCart />}
              color="info"
            />
          </>
        )}
      </div>
    </div>
  );
}