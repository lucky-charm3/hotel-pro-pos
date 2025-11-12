import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

export const REPORT_QUERY_KEY = 'reports';

export const useGetAllReports = (params={}) => {
    return useQuery({
        queryKey: [REPORT_QUERY_KEY, params],
        queryFn: () => reportService.getAllReports(params),
    });
};

export const useGetReportById = (id, options = {}) => {
    return useQuery({
        queryKey: [REPORT_QUERY_KEY, 'details', id],
        queryFn: () => reportService.getReportById(id),
        enabled: !!id,
        ...options
    });
};

export const useGenerateReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reportService.generateReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REPORT_QUERY_KEY] });
        },
    });
};

export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reportService.deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REPORT_QUERY_KEY] });
        },
    });
};
