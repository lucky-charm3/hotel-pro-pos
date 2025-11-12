import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bankingService } from '../services/bankingService';

export const BANKING_QUERY_KEY = 'banking';
export const BANKING_SUMMARY_KEY = 'bankingSummary';

export const useGetAllBanking = (params={}) => {
    return useQuery({
        queryKey: [BANKING_QUERY_KEY, params],
        queryFn: () => bankingService.getAllBanking(params),
    });
};

export const useGetBankingSummary = () => {
    return useQuery({
        queryKey: [BANKING_SUMMARY_KEY],
        queryFn: bankingService.getBankingSummary,
    });
};

export const useGetBankingById = (id, options = {}) => {
    return useQuery({
        queryKey: [BANKING_QUERY_KEY, 'details', id],
        queryFn: () => bankingService.getBankingById(id),
        enabled: !!id,
        ...options
    });
};

export const useCreateBanking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bankingService.createBanking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANKING_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [BANKING_SUMMARY_KEY] });
        },
    });
};

export const useUpdateBanking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, bankingData }) => bankingService.updateBanking(id, bankingData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [BANKING_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [BANKING_QUERY_KEY, 'details', variables.id] });
            queryClient.invalidateQueries({ queryKey: [BANKING_SUMMARY_KEY] });
        },
    });
};

export const useDeleteBanking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bankingService.deleteBanking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BANKING_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [BANKING_SUMMARY_KEY] });
        },
    });
};
