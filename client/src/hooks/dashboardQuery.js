import { useQuery } from '@tanstack/react-query';
import {dashboardService} from '../services/dashboardService.js';

const DASHBOARD_KEY = 'dashboard';

export const useGetDashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  return useQuery({
    queryKey: [DASHBOARD_KEY, today, weekStart, monthStart],
    queryFn: () => dashboardService.getDashboardSummary({
      start_date: weekStart,
      end_date: today,
      month_start: monthStart
    }),
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
  });
};