import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleService } from '../services/saleService';
import {useAuth} from '../contexts/authContext.jsx'

export const SALE_QUERY_KEY = 'sales';
export const CASHIER_SALES_KEY = 'cashierSales';
export const TOTAL_SALES_KEY = 'totalSales';

export const useGetAllSales = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [SALE_QUERY_KEY, params],
    queryFn: () => saleService.getAllSales(params),
    ...options
  });
};

export const useGetSaleById = (id, options = {}) => {
    return useQuery({
        queryKey: [SALE_QUERY_KEY, 'details', id],
        queryFn: () => saleService.getSaleById(id),
        enabled: !!id,
        ...options
    });
};

export const useGetSaleDetails = (id, options = {}) => {
    return useQuery({
        queryKey: [SALE_QUERY_KEY, 'details-view', id],
        queryFn: () => saleService.getSaleDetails(id),
        enabled: !!id,
        ...options
    });
};

export const useGetCashierSales = (options = {}) => {
  const { user } = useAuth(); 
  
  return useQuery({
    queryKey: [CASHIER_SALES_KEY, user?._id, options], 
    queryFn: () => saleService.getCashierSales(user?._id, options),
    staleTime: 5 * 60 * 1000,
    enabled: !!user?._id, 
    ...options
  });
};

export const useGetTotalSalesToday = () => {
    return useQuery({
        queryKey: [TOTAL_SALES_KEY, 'today'],
        queryFn: saleService.getTotalSalesToday,
    });
};

export const useCreateSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saleService.createSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SALE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CASHIER_SALES_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_SALES_KEY, 'today'] });
        },
    });
};

export const useDeleteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saleService.deleteSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SALE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [CASHIER_SALES_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_SALES_KEY, 'today'] });
        },
    });
};
