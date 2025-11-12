import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService.js';

export const EXPENSE_QUERY_KEY = 'expenses';
export const TOTAL_EXPENSES_KEY = 'totalExpenses';

export const useGetAllExpenses = (params) => {
    return useQuery({
        queryKey: [EXPENSE_QUERY_KEY, params],
        queryFn: () => expenseService.getAllExpenses(params),
    });
};

export const useGetExpenseById = (id, options = {}) => {
    return useQuery({
        queryKey: [EXPENSE_QUERY_KEY, 'details', id],
        queryFn: () => expenseService.getExpenseById(id),
        enabled: !!id,
        ...options
    });
};

export const useGetTotalExpenses = () => {
    return useQuery({
        queryKey: [TOTAL_EXPENSES_KEY],
        queryFn: expenseService.getTotalExpenses,
    });
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: expenseService.createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_EXPENSES_KEY] });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, expenseData }) => expenseService.updateExpense(id, expenseData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEY, 'details', variables.id] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_EXPENSES_KEY] });
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: expenseService.deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [TOTAL_EXPENSES_KEY] });
        },
    });
};
