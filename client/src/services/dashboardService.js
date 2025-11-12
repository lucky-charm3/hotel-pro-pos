import axiosInstance from './axiosInstance.js';

const DASHBOARD_BASE_URL = '/api/dashboard';

export const dashboardService = {
  getDashboardSummary: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.month_start) queryParams.append('month_start', params.month_start);

    const url = `${DASHBOARD_BASE_URL}/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  }
};